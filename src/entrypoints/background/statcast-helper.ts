import type {IDBPDatabase} from "idb";
import type {AdditionalStatData, StatcastDB} from "./statcast";
import type {ExtendedPercentileProperty} from "@/utils/stats";
import {isWASMCustomStat, type JSCustomStat, type StatCache, type WASMCustomStat} from "@/utils/stats/custom_stats";
import { distributionDataJS, distributionDataWASM } from "./custom-stats";

export function* seasonDates(season: number): Generator<string> {
    if (season < 2008) {
        return;
    }

    const toIsoDate: (date: Date) => string = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const today = new Date().setHours(0, 0, 0, 0);

    const start = new Date(season, 3 - 1, 15);
    const end = new Date(season, 11 - 1, 15);

    for (let date = new Date(start); date <= end && Number(date) < today; date.setDate(date.getDate() + 1)) {
        yield toIsoDate(date);
    }
}

export async function modifyAdditionalStatData(stat: ExtendedPercentileProperty, season: number, db: IDBPDatabase<StatcastDB>, modify: (data: AdditionalStatData) => Promise<AdditionalStatData | void>): Promise<AdditionalStatData> {
    const data: AdditionalStatData = (await db.get('additionalStatData', [season, stat.value])) ?? {};
    const result = await modify(data);
    const newData = result == undefined ? data : result;
    await db.put('additionalStatData', newData, [season, stat.value]);
    return newData;
}

export async function getDistributionData(stat: JSCustomStat<any> | WASMCustomStat<any>, season: number, db: IDBPDatabase<StatcastDB>): Promise<{ mean: number, stdev: number, qual: number }> {
    const data = await modifyAdditionalStatData(stat.property, season, db, async (data) => {        
        if (data.distributionData == undefined) {
            const cache = await db.get('stats', [season, stat.property.value]);
            if (cache != undefined) {
                data.distributionData = isWASMCustomStat(stat) ? distributionDataWASM(stat, cache) : await distributionDataJS(stat, cache);
            }
        }
        
        return data;
    });
    
    return data.distributionData!;
}

export async function getStatFromDB(stat: ExtendedPercentileProperty, season: number, player: number, db: IDBPDatabase<StatcastDB>): Promise<object | undefined> {
    const cache: StatCache<object> | undefined = await db.get('stats', [season, stat.value]);

    if (cache === undefined) {
        return undefined;
    }

    return cache.by_player[String(player)];
}

export async function getDayFromURL(date: string): Promise<Uint8Array<ArrayBuffer> | null> {
    const URL: string = `https://baseballsavant.mlb.com/statcast_search/csv?all=true&hfPT=&hfAB=&hfBBT=&hfPR=&hfZ=&stadium=&hfBBL=&hfNewZones=&hfGT=R%7CPO%7CS%7C=&hfSea=&hfSit=&player_type=pitcher&hfOuts=&opponent=&pitcher_throws=&batter_stands=&hfSA=&game_date_gt=${date}&game_date_lt=${date}&team=&position=&hfRO=&home_road=&hfFlag=&metric_1=&hfInn=&min_pitches=0&min_results=0&group_by=name&sort_col=pitches&player_event_sort=h_launch_speed&sort_order=desc&min_abs=0&type=details&`;

    const result = await fetch(URL);
    if (!result.ok) {
        return null;
    }

    const bytes = await result.bytes();
    if (isEmptyDay(bytes)) {
        return null;
    }

    return bytes;
}

export async function getDaySubsidiaryFromURL(date: string): Promise<Uint8Array<ArrayBuffer> | null> {
    const URL: string = `https://rttv.ca/statcast-subsidiary-csv/${date}.csv`;

    const result = await fetch(URL);
    if (!result.ok) {
        return null;
    }

    const bytes = await result.bytes();
    if (isEmptyDay(bytes)) {
        return null;
    }

    return bytes;
}

export function isEmptyDay(bytes: Uint8Array<ArrayBuffer>): boolean {
    return bytes.indexOf("\n".charCodeAt(0)) == bytes.lastIndexOf("\n".charCodeAt(0))
}

export async function getDayBytesFromDB(date: string, db: IDBPDatabase<StatcastDB>): Promise<Uint8Array<ArrayBuffer>> {
    return await db.get('date', date) ?? new Uint8Array();
}

export async function getDaySubsidiaryBytesFromDB(date: string, db: IDBPDatabase<StatcastDB>): Promise<Uint8Array<ArrayBuffer>> {
    return await db.get('dateSubsidiary', date) ?? new Uint8Array();
}

export async function getFileSizeForSeason(season: number, db: IDBPDatabase<StatcastDB>): Promise<number> {
    const result = await db.get('season', String(season));
    return result?.fileSize ?? 0;
}

export async function getCachedSeasons(db: IDBPDatabase<StatcastDB>): Promise<number[]> {
    return (await db.getAllKeys('season')).map(Number);
}

export async function purgeSeason(season: number, db: IDBPDatabase<StatcastDB>) {
    for (const date of seasonDates(season)) {
        await db.delete('date', date);
        await db.delete('dateSubsidiary', date);
    }
    await db.delete('season', String(season));
    await db.delete('stats', IDBKeyRange.bound([season], [season, []]));
}
