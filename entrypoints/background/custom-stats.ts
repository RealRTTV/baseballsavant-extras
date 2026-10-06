import {
    type BaseCache,
    type CustomStat,
    isWASMCustomStat,
    type JSCustomStat,
    type WASMCustomStat
} from "@/utils/stats/custom_stats";
import {isExtendedPercentileProperty} from "@/utils/stats";
import {prettyPrintTimeSince} from "@/utils/dates.ts";
import type {WASMExports} from "@/utils/wasm.ts";
import {
    __setLOADED_CUSTOM_STAT_PROPERTIES,
    CUSTOM_STATS_STORAGE,
    type CustomStatFile,
    LOADED_CUSTOM_STAT_PROPERTIES
} from "@/utils/custom-stats.ts";
import {sendB2WMessage} from "@/entrypoints/background/worker.ts";
import {sendUpdateLoadedCustomStatProperties} from "@/utils/messages/update-loaded-custom-stat-properties.ts";

let LOADED_CUSTOM_STATS: CustomStat<any, any>[] = [];

export let STAT_TO_FILENAME_MAP: Record<string, string> = {};

async function parseJSStat(src: string, filename: string): Promise<JSCustomStat<any, any>[]> {
    const response = await sendB2WMessage({ registerCustomStatFromSrc: src, filename });
    if ('error' in response.payload) {
        throw new Error(response.payload.error);
    }

    if ('registerCustomStatFromSrcPercentileProperties' in response.payload) {
    } else {
        throw new Error("Incorrect payload.");
    }

    const properties = response.payload.registerCustomStatFromSrcPercentileProperties;
    return properties.map(property => ({
        property,
        create_cache: async () => {
            const response = (await sendB2WMessage({ createCacheFor: property.value }));
            if ('createCacheFor' in response.payload) return response.payload.createCacheFor;
            throw new Error("Incorrect payload.");
        },
        on_incremental: async (cache) => {
            await sendB2WMessage({ onIncremental: property.value, cache });
        },
        apply: async (cache, rows, subsidiaryRows) => {
            await sendB2WMessage({ apply: property.value, cache, rows, subsidiaryRows });
        },
        on_finish_apply: async (cache): Promise<"rerun" | false> => {
            const response = (await sendB2WMessage({ onFinishApply: property.value, cache }));
            if ('onFinishApply' in response.payload) return response.payload.onFinishApply;
            throw new Error("Incorrect payload.");
        },
        value: async (value) => {
            const response = (await sendB2WMessage({ valueFor: property.value, value }));
            if ('valueFor' in response.payload) return response.payload.valueFor;
            throw new Error("Incorrect payload.");
        },
        samples: async (value) => {
            const response = (await sendB2WMessage({ samplesFor: property.value, value }));
            if ('samplesFor' in response.payload) return response.payload.samplesFor;
            throw new Error("Incorrect payload.");
        }
    } satisfies JSCustomStat<any, any>));
}

async function parseWASMStat(src: Uint8Array<ArrayBuffer>): Promise<WASMCustomStat<any>[]> {
    function stringFromAddr(ptr: number, len: number, memory: WebAssembly.Memory): string {
        return new TextDecoder().decode(new Uint8Array(memory.buffer, ptr, len));
    }

    const { instance, module } = await WebAssembly.instantiate(src, {
        env: {
            log: (ptr: number, len: number) => console.log(stringFromAddr(ptr, len, (instance.exports as WASMExports).memory)),
            warn: (ptr: number, len: number) => console.warn(stringFromAddr(ptr, len, (instance.exports as WASMExports).memory)),
            error: (ptr: number, len: number) => console.error(stringFromAddr(ptr, len, (instance.exports as WASMExports).memory)),
        }
    });

    const {
        memory,
        malloc,
        free,
        _start,
        deserialize_cache,
        serialize_cache,
        on_incremental,
        apply,
        on_finish_apply,
        value,
        samples,
    } = instance.exports as WASMExports;

    function copyBytes(bytes: Uint8Array<ArrayBuffer> | null): { ptr: number, len: number } {
        if (bytes === null) {
            return { ptr: 0, len: 0 };
        }

        const len = bytes.length;
        const ptr = malloc(len, 1);
        new Uint8Array(memory.buffer, ptr, len).set(bytes);
        return { ptr, len };
    }

    function copyString(str: string): ReturnType<typeof copyBytes> {
        return copyBytes(new TextEncoder().encode(str));
    }

    _start();

    const percentileProperty = JSON.parse(new TextDecoder().decode(WebAssembly.Module.customSections(module, 'percentile_property')[0]!));
    if (!isExtendedPercentileProperty(percentileProperty)) {
        console.error('failed to parse WASM stat; invalid percentile property');
        return [];
    }

    return [{
        property: percentileProperty,
        deserialize_cache: function (cache: BaseCache<any> | undefined): boolean {
            const json = cache ? JSON.stringify(cache) : '';
            const { ptr, len } = copyString(json);
            const result = deserialize_cache(ptr, len);
            free(ptr, len, 1);
            return !!result;
        },
        serialize_cache: function (): BaseCache<any> {
            const ptrlen = BigInt(serialize_cache());
            const len = Number(ptrlen >> 32n);
            const ptr = Number(ptrlen & 0xFFFFFFFFn);
            const str = stringFromAddr(ptr, len, memory);
            free(ptr, len, 1);
            const cache: BaseCache<any> = JSON.parse(str);
            cache.uses_subsidiary_csv = percentileProperty.wants_subsidiary_csv;
            return cache;
        },
        on_incremental,
        apply: function (data, subsidiary_data): void {
            const { ptr, len } = copyBytes(data);
            const { ptr: sub_ptr, len: sub_len } = copyBytes(subsidiary_data);
            apply(ptr, len, sub_ptr, sub_len);
            free(ptr, len, 1);
            free(sub_ptr, sub_len, 1);
        },
        on_finish_apply: () => (!!on_finish_apply()) ? 'rerun' : false,
        value: function (obj): number {
            const json = JSON.stringify(obj);
            const { ptr, len } = copyString(json);
            const result = value(ptr, len);
            free(ptr, len, 1);
            return result;
        },
        samples: function (obj): number {
            const json = JSON.stringify(obj);
            const { ptr, len } = copyString(json);
            const result = samples(ptr, len);
            free(ptr, len, 1);
            return result;
        },
    } satisfies WASMCustomStat<any>];
}

async function parseStorage(record: Record<string, CustomStatFile>) {
    const customStats: CustomStat<any>[] = [];
    const statToFilenameMap: Record<string, string> = {};
    for (const [filename, { src }] of Object.entries(record)) {
        let values: CustomStat<any, any>[] = [];
        try {
            if (filename.endsWith('.js')) {
                values.push(...await parseJSStat(new TextDecoder().decode(src), filename));
            } else if (filename.endsWith('.wasm')) {
                values.push(...await parseWASMStat(src));
            } else {
                console.error(`unknown extension for custom stat: '${filename.split('/').at(-1)}'`)
                continue;
            }
        } catch (e) {
            console.error("Failed to parse stat:", e);
        }

        for (const value of values) {
            if (statToFilenameMap[value.property.value] === undefined) {
                statToFilenameMap[value.property.value] = filename;
                customStats.push(value);
            } else {
                console.warn(`stat ${value.property.value} from ${filename} already loaded under ${statToFilenameMap[value.property.value]}`);
            }
        }
    }

    STAT_TO_FILENAME_MAP = statToFilenameMap;
    LOADED_CUSTOM_STATS = customStats;
    __setLOADED_CUSTOM_STAT_PROPERTIES(customStats.map(stat => stat.property));
    await sendUpdateLoadedCustomStatProperties(LOADED_CUSTOM_STAT_PROPERTIES);

}

export async function refreshCustomStats() {
    await CUSTOM_STATS_STORAGE.getValue().then(parseStorage);
    CUSTOM_STATS_STORAGE.watch(parseStorage);
}

export function getCustomStatForName(name: string): CustomStat<any, any> | undefined {
    return LOADED_CUSTOM_STATS.find(stat => stat.property.value === name);
}

export async function removeCustomStatFile(filename: string) {
    const value = await CUSTOM_STATS_STORAGE.getValue();
    delete value[filename];
    // watchers should run; no need to run parseStorage
    await CUSTOM_STATS_STORAGE.setValue(value);
    await sendB2WMessage({ removeCustomStatByFilename: filename });
}

export async function addCustomStat(name: string, contents: Uint8Array<ArrayBuffer>) {
    const CUSTOM_STATS = await CUSTOM_STATS_STORAGE.getValue();
    if (name in CUSTOM_STATS) {
        console.info(`Custom Stat '${name}' already exists (created ${prettyPrintTimeSince(CUSTOM_STATS[name]!.lastUpdated)}), replacing...`);
    }
    CUSTOM_STATS[name] = { src: contents, lastUpdated: new Date() };
}

export function qualificationThreshold<T extends object | string, Cache extends BaseCache<T>>(stat: CustomStat<T, Cache>, cache: Cache): number {
    return Math.floor(0.25 * Math.max(...Object.values(cache.by_player).map(instance => (stat as any).samples(instance))));
}

export function distributionData<T extends object | string, Cache extends BaseCache<T>>(stat: CustomStat<T, Cache>, cache: Cache): { mean: number, stdev: number, qual: number } {
    const threshold: number = (cache.qualification_threshold ??= qualificationThreshold(stat, cache));
    if (isWASMCustomStat(stat)) {
        stat.deserialize_cache(cache);
    }
    const values: number[] = Object.values(cache.by_player).filter(instance => (stat as any).samples(instance) >= threshold).map((stat as any).value);

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / values.length;

    return { mean, stdev: Math.sqrt(variance), qual: threshold };
}
