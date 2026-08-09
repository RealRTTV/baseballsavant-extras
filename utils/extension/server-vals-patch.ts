import {ENABLED_SEASONS, STATS} from "@/utils/shared/statcast.ts";
import {zScoreToPercentile} from "@/utils/shared/math.ts";
import type {ServerValsPatch} from "@/utils/shared/server-vals-patch.ts";
import {openDB} from "idb";
import {getDistributionData, getStatFromDB, type StatcastDB} from "@/utils/extension/statcast.ts";

export async function createServerValsPatch(playerId: number): Promise<ServerValsPatch> {
    const patches: ServerValsPatch = {
        playerId,
        patches: []
    }

    const db = await openDB<StatcastDB>('statcast-data');

    for (const stat of STATS) {
        for (const season of ENABLED_SEASONS) {
            const value = await getStatFromDB(stat, season, playerId, db);

            if (value === undefined) {
                continue;
            }

            const { mean, stdev } = getDistributionData(stat, season);
            const valuePretty: number = stat.valuePretty(value);
            const percentile: number = zScoreToPercentile((stat.value(value) - mean) / stdev);

            patches.patches.push({
                key: stat.name,
                percentile,
                season,
                value: valuePretty
            })
        }
    }

    return patches;
}