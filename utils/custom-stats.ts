import type {CustomStat} from "@/utils/stats/custom_stats";
import firstPitchStrikeFileContents from '@/.output/custom_stats/first-pitch-strike.js?raw';
import type {ExtendedPercentileProperty} from "@/utils/stats";

type CustomStatFile = {
    src: string;
};

const CUSTOM_STATS_STORAGE = storage.defineItem<Record<string, CustomStatFile>>('local:custom-stats', {
    fallback: {
        'first-pitch-strike.js': {
            src: firstPitchStrikeFileContents,
        }
    }
});

export let LOADED_CUSTOM_STAT_PROPERTIES: ExtendedPercentileProperty[] = [];

let LOADED_CUSTOM_STATS: CustomStat<any>[] = [];

async function parseStorage(record: Record<string, CustomStatFile>) {
    const customStats: CustomStat<any>[] = [];
    for (const [filename, { src }] of Object.entries(record)) {
        const objectURL = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        const moduleNamespace = await import(/* @vite-ignore */ objectURL);
        const values = Object.values(moduleNamespace);
        console.log(filename, values);
        URL.revokeObjectURL(objectURL);
    }
    const properties = customStats.map(stat => stat.property);
    LOADED_CUSTOM_STATS = customStats;
    LOADED_CUSTOM_STAT_PROPERTIES = properties;
}

export async function refreshCustomStats() {
    CUSTOM_STATS_STORAGE.getValue().then(parseStorage);
}

export function getCustomStatForName(name: string): CustomStat<any> | undefined {
    return LOADED_CUSTOM_STATS.find(stat => stat.property.value === name);
}

export function distributionData<T extends object>(stat: CustomStat<T>, byPlayer: Record<string, T>): [number, number] {
    const values = Object.values(byPlayer).filter(instance => stat.is_qualified(instance, stat.property.qualification_threshold)).map(instance => stat.value(instance));

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / values.length;

    return [mean, Math.sqrt(variance)];
}
