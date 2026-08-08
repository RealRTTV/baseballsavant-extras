import type {ServerVals} from "@/utils/shared/data_types/server-vals.ts";
import {ENABLED_SEASONS, type MessageResponse, STATS} from "@/utils/shared/data_types/statcast.ts";
import {type CustomStat} from "@/utils/shared/custom_stats";

async function getStatFromDB(stat: CustomStat<any>, season: number, player: number): Promise<Object | undefined> {
    const response: MessageResponse<Object> = (await browser.runtime.sendMessage({ type: 'getStatFromDB', stat: stat.name, season, player }))!;
    if (response.error !== undefined) {
        console.error(response.error);
        return undefined;
    }

    return response.result!;
}

async function getDistributionData(stat: CustomStat<any>, season: number): Promise<{ mean: number, stdev: number } | undefined> {
    const response: MessageResponse<{ mean: number, stdev: number }> = await browser.runtime.sendMessage({ type: 'getDistributionData', stat: stat.name, season });
    if (response.error !== undefined) {
        console.error(response.error);
        return undefined;
    }

    return response.result!;
}

export async function modifyServerVals(serverVals: ServerVals) {
    for (const stat of STATS) {
        for (const season of ENABLED_SEASONS) {
            const statcastSeason = serverVals.statcast.find(szn => szn.year === season);

            if (statcastSeason === undefined) {
                continue;
            }

            const value = await getStatFromDB(stat, season, Number(serverVals.playerId));
            if (value === undefined) {
                continue;
            }

            const value_pretty: string = stat.value_pretty(value);
            const { mean, stdev } = await getDistributionData(stat, season) ?? { mean: 0, stdev: 1 };
            const percentile: number = (stat.value(value) - mean) / stdev;
            (statcastSeason as any)[`${stat.name}`] = value_pretty;
            (statcastSeason as any)[`percent_rank_${stat.name}`] = Math.round(percentile);
            (statcastSeason as any)[`percent_rank_${stat.name}_unrounded`] = percentile;
        }
    }
}