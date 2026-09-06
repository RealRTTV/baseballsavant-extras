import {type BaseCache, type CustomStat, isCustomStat} from "@/utils/stats/custom_stats";
import firstPitchStrikeJSFileContents from '@/.output/custom_stats/first-pitch-strike.js?uint8array';
import firstPitchStrikeWASMFileContents from '@/.output/custom_stats/first_pitch_strike.wasm?uint8array';
import {type ExtendedPercentileProperty, isExtendedPercentileProperty} from "@/utils/stats";
import {prettyPrintTimeSince} from "@/utils/dates.ts";
import type {WASMExports} from "@/utils/wasm.ts";

type CustomStatFile = {
    src: Uint8Array<ArrayBuffer>;
    lastUpdated: Date,
};

export const CUSTOM_STATS_STORAGE = storage.defineItem<Record<string, CustomStatFile>>('local:custom-stats', {
    fallback: {
        // 'first-pitch-strike.js': {
        //     src: firstPitchStrikeJSFileContents,
        //     lastUpdated: new Date(),
        // },
        'first-pitch-strike.wasm': {
            src: firstPitchStrikeWASMFileContents,
            lastUpdated: new Date(),
        },
    }
});

let LOADED_CUSTOM_STATS: CustomStat<any, any>[] = [];

export let STAT_TO_FILENAME_MAP: Record<string, string> = {};

export let LOADED_CUSTOM_STAT_PROPERTIES: ExtendedPercentileProperty[] = [];

async function parseJSStat(src: string): Promise<CustomStat<any, any>[]> {
    const objectURL = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    const moduleNamespace = await import(/* @vite-ignore */ objectURL);
    const values = Object.values(moduleNamespace).filter(isCustomStat);
    URL.revokeObjectURL(objectURL);
    return values;
}

function stringFromAddr(ptr: number, len: number, exports: WASMExports): string {
    return new TextDecoder().decode(new Uint8Array(exports.memory.buffer, ptr, len));
}

async function parseWASMStat(src: Uint8Array<ArrayBuffer>): Promise<CustomStat<any, any>[]> {
    const { instance, module } = await WebAssembly.instantiate(src, {
        env: {
            log: (ptr: number, len: number) => console.log(stringFromAddr(ptr, len, instance.exports as WASMExports)),
            warn: (ptr: number, len: number) => console.warn(stringFromAddr(ptr, len, instance.exports as WASMExports)),
            error: (ptr: number, len: number) => console.error(stringFromAddr(ptr, len, instance.exports as WASMExports)),
        }
    });

    const exports = instance.exports as WASMExports;

    exports.main();

    const percentileProperty = JSON.parse(new TextDecoder().decode(WebAssembly.Module.customSections(module, 'percentile_property')[0]!));
    console.log(percentileProperty);
    if (!isExtendedPercentileProperty(percentileProperty)) {
        console.error('failed to parse WASM stat; invalid percentile property');
        return [];
    }

    return [];

    // return [{
    //     property: percentileProperty,
    //     create_cache: undefined,
    //     on_incremental: undefined,
    //     apply: undefined,
    //     on_finish_apply: undefined,
    //     value: undefined,
    //     samples: undefined,
    // } satisfies CustomStat<any, any>];
}

async function parseStorage(record: Record<string, CustomStatFile>) {
    const customStats: CustomStat<any>[] = [];
    const statToFilenameMap: Record<string, string> = {};
    for (const [filename, { src }] of Object.entries(record)) {
        let values: CustomStat<any, any>[] = [];
        if (filename.endsWith('.js')) {
            values = await parseJSStat(new TextDecoder().decode(src));
        } else if (filename.endsWith('.wasm')) {
            values = await parseWASMStat(src);
        } else {
            console.error(`unknown extension for custom stat: '${filename.split('/').at(-1)}'`)
            continue;
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
    LOADED_CUSTOM_STAT_PROPERTIES = customStats.map(stat => stat.property);

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
}

export async function addCustomStat(name: string, contents: string) {
    const CUSTOM_STATS = await CUSTOM_STATS_STORAGE.getValue();
    if (name in CUSTOM_STATS) {
        console.info(`Custom Stat '${name}' already exists (created ${prettyPrintTimeSince(CUSTOM_STATS[name]!.lastUpdated)}), replacing...`);
    }
    CUSTOM_STATS[name] = { src: contents, lastUpdated: new Date() };
}

export function qualificationThreshold<T extends object, Cache extends BaseCache<T>>(stat: CustomStat<T, Cache>, cache: Cache): number {
    return Math.floor(0.25 * Math.max(...Object.values(cache.by_player).map(instance => stat.samples(instance))));
}

export function distributionData<T extends object, Cache extends BaseCache<T>>(stat: CustomStat<T, Cache>, cache: Cache): { mean: number, stdev: number, qual: number } {
    const threshold = (cache.qualification_threshold ??= qualificationThreshold(stat, cache));
    const values = Object.values(cache.by_player).filter(instance => stat.samples(instance) >= threshold).map(stat.value);

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / values.length;

    return { mean, stdev: Math.sqrt(variance), qual: threshold };
}
