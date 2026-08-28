import {clamp, zScoreToPercentile} from "@/utils/shared/math";
import type {ServerValsPatch} from "@/utils/shared/server-vals-patch";
import {openDB} from "idb";
import {
    type StatcastDB
} from "@/utils/extension/statcast";
import {getConfig} from "@/utils/extension/config.ts";
import {getDistributionData, getStatFromDB} from "@/utils/extension/statcast-helper.ts";

export async function createServerValsPatch(playerId: number): Promise<ServerValsPatch> {
    const patches: ServerValsPatch = {
        playerId,
        patches: [],
        summaryPatches: [],
        forceDisplayPatches: [],
    }

    const db = await openDB<StatcastDB>('statcast-data');

    for (const stat of getConfig().activeStats) {
        for (const season of getConfig().activeSeasons) {
            const statValue: object | undefined = await getStatFromDB(stat, season, playerId, db);

            const { mean, stdev } = getDistributionData(stat.property, season)!;
            const value: number | null = statValue === undefined ? null : stat.value(statValue);
            const zScore: number | null = value == null ? null : stat.property.invert === true ? (mean - value / stdev) : (value - mean) / stdev;
            const percentile: number | null = zScore === null ? null : clamp(zScoreToPercentile(zScore), 1, 100);

            patches.patches.push({
                key: stat.property.value,
                percentile,
                season,
                value
            })

            patches.summaryPatches.push({
                metric: stat.property.value,
                avg_metric: mean,
                stddev_metric: stdev,
                qualification_threshold: stat.property.qualification_threshold,
                season,
            })
        }

        patches.forceDisplayPatches.push({
            metric: stat.property.value,
        })
    }

    return patches;
}