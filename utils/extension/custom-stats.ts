import firstPitchStrikeFileContents from '@/.output/custom_stats/first-pitch-strike.js?raw';
import type {CustomStat} from "@/utils/shared/stats/custom_stats";

type CustomStatFile = {
    src: string;
};

const CUSTOM_STATS_STORAGE = storage.defineItem<Record<string, CustomStatFile>>('local:custom-stats', { fallback: {
    'first-pitch-strike.js': {
        src: firstPitchStrikeFileContents,
    }
} });

export const ALL_REGISTERED_CUSTOM_STATS: CustomStat<any>[] = [];

async function parseStorage(record: Record<string, CustomStatFile>) {
    ALL_REGISTERED_CUSTOM_STATS.length = 0;
    for (const [filename, { src }] of Object.entries(record)) {
        const objectURL = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        const moduleNamespace = await import(/* @vite-ignore */ objectURL);
        const values = Object.values(moduleNamespace);
        console.log(filename, values);
        URL.revokeObjectURL(objectURL);
    }
}

function initializeCrossWorldCache() {
    CUSTOM_STATS_STORAGE.watch(parseStorage);
    CUSTOM_STATS_STORAGE.getValue().then(parseStorage);
}

initializeCrossWorldCache();
