import "@/utils/shared/stats";
import {type CustomStat, FIRST_PITCH_STRIKE_CODE} from "@/utils/shared/stats/custom_stats";

export const ENABLED_SEASONS: Array<number> = [
    'current'
].map(entry => entry.toLowerCase() === 'current' ? new Date().getFullYear() : Number(entry));

export const CALCULATED_STATS: Array<CustomStat<any>> = [
    FIRST_PITCH_STRIKE_CODE,
];
