import {clamp, zScoreToPercentile} from "@/utils/math";
import type {ServerValsPatch} from "@/utils/server-vals-patch";
import {openDB} from "idb";
import {
    type StatcastDB
} from "@/entrypoints/background/statcast";
import {getConfig} from "@/utils/config.ts";
import {getDistributionData, getStatFromDB} from "@/entrypoints/background/statcast-helper.ts";
import {getCustomStatForName} from "@/utils/custom-stats.ts";

export async function createServerValsPatch(playerId: number): Promise<ServerValsPatch> {
    const patches: ServerValsPatch = {
        playerId,
        patches: [],
        summaryPatches: [],
        forceDisplayPatches: [],
    }

    const db = await openDB<StatcastDB>('statcast-data');

    for (const stat of getConfig().activeStats) {
        const statInstance = getCustomStatForName(stat.value)!;
        for (const season of getConfig().activeSeasons) {
            const statValue: object | undefined = await getStatFromDB(stat, season, playerId, db);

            const { mean, stdev, qual } = getDistributionData(stat, season)!;
            const value: number | null = statValue === undefined ? null : statInstance.value(statValue);
            const zScore: number | null = value == null ? null : stat.invert === true ? (mean - value / stdev) : (value - mean) / stdev;
            const percentile: number | null = zScore === null ? null : clamp(zScoreToPercentile(zScore), 1, 100);

            patches.patches.push({
                key: stat.value,
                percentile,
                season,
                value
            })

            patches.summaryPatches.push({
                metric: stat.value,
                avg_metric: mean,
                stddev_metric: stdev,
                qualification_threshold: qual,
                season,
            })
        }

        patches.forceDisplayPatches.push({
            metric: stat.value,
        })
    }

    return patches;
}