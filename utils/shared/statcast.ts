import {type CustomStat, FIRST_PITCH_STRIKE} from "@/utils/shared/stats/custom_stats";

export const ENABLED_SEASONS: Array<number> = [
    'current'
].map(entry => entry.toLowerCase() === 'current' ? new Date().getFullYear() : Number(entry));

export const STATS: Array<CustomStat<any>> = [
    FIRST_PITCH_STRIKE,
];
