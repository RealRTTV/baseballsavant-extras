//@ts-ignore
import firstPitchStrikeJSFileContents from '@/.output/custom_stats/first-pitch-strike.js?uint8array';
//@ts-ignore
import firstPitchStrikeWASMFileContents from '@/.output/custom_stats/first_pitch_strike.wasm?uint8array';
//@ts-ignore
import missDistanceWASMFileContents from '@/.output/custom_stats/miss_distance.wasm?uint8array';

import type {ExtendedPercentileProperty} from "@/utils/stats";

export type CustomStatFile = {
    src: Uint8Array<ArrayBuffer>;
    lastUpdated: Date,
};

export const CUSTOM_STATS_STORAGE = storage.defineItem<Record<string, CustomStatFile>>('local:custom-stats', {
    fallback: {
        'first-pitch-strike.js': {
            src: firstPitchStrikeJSFileContents,
            lastUpdated: new Date(),
        },
        // 'first-pitch-strike.wasm': {
        //     src: firstPitchStrikeWASMFileContents,
        //     lastUpdated: new Date(),
        // },
        'miss-distance.wasm': {
            src: missDistanceWASMFileContents,
            lastUpdated: new Date(),
        },
    }
});

export let LOADED_CUSTOM_STAT_PROPERTIES: ExtendedPercentileProperty[] = [];

export function __setLOADED_CUSTOM_STAT_PROPERTIES(value: ExtendedPercentileProperty[]) {
    LOADED_CUSTOM_STAT_PROPERTIES = value;
}
