import {ENABLED_SEASONS, type MessageResponse, STATS} from "@/utils/shared/statcast.ts";
import {type CustomStat} from "@/utils/shared/custom_stats";
import {sendMessage} from "@/utils/main/send-message.ts";
import {zScoreToPercentile} from "@/utils/shared/math.ts";
import type {ServerValsPatch} from "@/utils/shared/server-vals-patch.ts";

async function getStatFromDB(stat: CustomStat<any>, season: number, player: number): Promise<object | undefined> {
    const response: MessageResponse<object> = (await sendMessage({ type: 'getStatFromDB', stat: stat.name, season, player }))!;
    if (response.error !== undefined) {
        console.error(response.error);
        return undefined;
    }

    return response.result!;
}

async function getDistributionData(stat: CustomStat<any>, season: number): Promise<{ mean: number, stdev: number } | undefined> {
    const response: MessageResponse<{ mean: number, stdev: number }> = await sendMessage({ type: 'getDistributionData', stat: stat.name, season });
    if (response.error !== undefined) {
        console.error(response.error);
        return undefined;
    }

    return response.result!;
}

export async function createServerValsPatch(playerId: number): Promise<ServerValsPatch> {
    const patches: ServerValsPatch = {
        playerId,
        patches: []
    }

    for (const stat of STATS) {
        for (const season of ENABLED_SEASONS) {
            const request = getStatFromDB(stat, season, playerId);
            const request2 = getDistributionData(stat, season);

            const value = await request;
            if (value === undefined) {
                continue;
            }

            const value_pretty: number = stat.value_pretty(value);
            const { mean, stdev } = await request2 ?? { mean: 0, stdev: 1 };
            const percentile: number = zScoreToPercentile((stat.value(value) - mean) / stdev);

            patches.patches.push({
                key: stat.name,
                percentile,
                season,
                value: value_pretty
            })
        }
    }

    return patches;
}