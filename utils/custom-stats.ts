//@ts-ignore
import firstPitchStrikeJSFileContents from '@/.output/custom_stats/first-pitch-strike.js?uint8array';
//@ts-ignore
import firstPitchStrikeWASMFileContents from '@/.output/custom_stats/first_pitch_strike.wasm?uint8array';
//@ts-ignore
import missDistanceWASMFileContents from '@/.output/custom_stats/miss_distance.wasm?uint8array';

import type {ExtendedPercentileProperty} from "@/utils/stats";

export type CustomStatFile = {
    srcBase64: string;
    lastUpdated: Date,
};

export const CUSTOM_STATS_STORAGE = storage.defineItem<Record<string, CustomStatFile>>('local:custom-stats', {
    fallback: {
        'first-pitch-strike.js': {
            srcBase64: firstPitchStrikeJSFileContents.toBase64(),
            lastUpdated: new Date(),
        },
        // 'first-pitch-strike.wasm': {
        //     srcBase64: firstPitchStrikeWASMFileContents.toBase64(),
        //     lastUpdated: new Date(),
        // },
        'miss-distance.wasm': {
            srcBase64: missDistanceWASMFileContents.toBase64(),
            lastUpdated: new Date(),
        },
    }
});

export let LOADED_CUSTOM_STAT_PROPERTIES: ExtendedPercentileProperty[] = [];

export function __setLOADED_CUSTOM_STAT_PROPERTIES(value: ExtendedPercentileProperty[]) {
    LOADED_CUSTOM_STAT_PROPERTIES = value;
}
