import {ENABLED_SEASONS, STATS} from "@/utils/shared/statcast";
import {clamp, zScoreToPercentile} from "@/utils/shared/math";
import type {ServerValsPatch} from "@/utils/shared/server-vals-patch";
import {openDB} from "idb";
import {getDistributionData, getSampleNumberFromDB, getStatFromDB, type StatcastDB} from "@/utils/extension/statcast";

export async function createServerValsPatch(playerId: number): Promise<ServerValsPatch> {
    const patches: ServerValsPatch = {
        playerId,
        patches: [],
        summaryPatches: [],
    }

    const db = await openDB<StatcastDB>('statcast-data');

    for (const stat of STATS) {
        for (const season of ENABLED_SEASONS) {
            const statValue: object | undefined = await getStatFromDB(stat, season, playerId, db);
            const n: number = await getSampleNumberFromDB(stat, season, db);

            const { mean, stdev } = getDistributionData(stat, season);
            const value: number | null = statValue === undefined ? null : stat.value(statValue);
            const percentile: number | null = value === null ? null : clamp(zScoreToPercentile((value - mean) / stdev), 1, 100);

            patches.patches.push({
                key: stat.name,
                percentile,
                season,
                value
            })

            patches.summaryPatches.push({
                metric: stat.name,
                avg_metric: mean,
                stddev_metric: stdev,
                n,
                season,
            })
        }
    }

    return patches;
}