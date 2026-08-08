import Papa from 'papaparse';

import {type IDBPDatabase, type DBSchema, openDB} from 'idb';
import type {StatcastRow} from "@/utils/shared/data_types/statcast-row.ts";
import {type CustomStat, distributionData} from "@/utils/shared/custom_stats";
import {qualifiedPitchers} from "@/utils/extension/statsapi.ts";
import { ENABLED_SEASONS, STATS, type MessageResponse } from "@/utils/shared/data_types/statcast.ts";

interface StatcastDB extends DBSchema {
    date: {
        key: string;
        value: string;
    };
    stats: {
        key: [number, string];
        value: StatCache<any>;
    };
}

type StatCache<T> = {
    cached_dates: string[],
    by_player: Record<string, T>,
}

const DISTRIBUTION_METRICS: Record<string, [number, number]> = {};

async function messageWrapper<T>(closure: () => Promise<T>): Promise<MessageResponse<T>> {
    try {
        return { ok: true, result: await closure(), error: undefined };
    } catch (e) {
        return { ok: false, error: String(e), result: undefined };
    }
}

export async function statcastCustomStats() {
    const db = await openDB<StatcastDB>('statcast-data', 1, {
        upgrade(db) {
            db.createObjectStore('date');
            db.createObjectStore('stats');
        }
    });

    browser.runtime.onMessage.addListener(async (msg, _) => {
        switch (msg.type) {
            case 'getStatFromDB': {
                const statName: string = msg.stat;
                const stat = STATS.find(entry => entry.name === statName)!;
                const season: number = msg.season;
                const player: number = msg.player;
                return await messageWrapper<Object>(() => getStatFromDB(stat, season, player, db));
            }
            case 'getDistributionData': {
                const statName: string = msg.stat;
                const stat = STATS.find(entry => entry.name === statName)!;
                const season: number = msg.season;
                return await messageWrapper<{ mean: number, stdev: number }>(async () => {
                    const [mean, stdev] = DISTRIBUTION_METRICS[`${season}:${stat.name}`] ?? [0, 1];
                    return { mean, stdev };
                });
            }
            default:
                return undefined;
        }
    })

    console.log('Getting qualified pitchers per season...');
    const qualifiedPitchersBySeason: Record<number, Set<number>> = {};
    for (const season of ENABLED_SEASONS) {
        qualifiedPitchersBySeason[season] = new Set(await qualifiedPitchers(season));
    }

    console.log(qualifiedPitchersBySeason);

    console.log('Parsing statcast data...');
    for (const season of ENABLED_SEASONS) {
        await recacheAllPlays(season, db);
    }

    console.log('Calculating stats...');
    for (const stat of STATS) {
        for (const season of ENABLED_SEASONS) {
            console.log('Calculating ' + stat.name + '...');

            const cache: StatCache<any> | undefined = (await db.get('stats', [season, stat.name])) ?? { cached_dates: [], by_player: {} };

            const new_dates = seasonDates(season).filter(date => !cache.cached_dates.includes(date)).toArray();

            for (const date of new_dates) {
                const data = await getDayFromDB(date, db);
                stat.apply(data.data.filter(r => r.game_type === 'R'), cache.by_player);
            }
            cache.cached_dates.push(...new_dates);

            console.log(cache);
            const distribution = distributionData(stat, cache.by_player, qualifiedPitchersBySeason[season] ?? new Set());
            console.log(distribution);
            DISTRIBUTION_METRICS[`${season}:${stat.name}`] = distribution;

            await db.put('stats', cache, [season, stat.name]);
        }
    }
}

const URL: (start_dt: string, end_dt: string) => string = (start_dt, end_dt) => `https://baseballsavant.mlb.com/statcast_search/csv?all=true&hfPT=&hfAB=&hfBBT=&hfPR=&hfZ=&stadium=&hfBBL=&hfNewZones=&hfGT=R%7CPO%7CS%7C=&hfSea=&hfSit=&player_type=pitcher&hfOuts=&opponent=&pitcher_throws=&batter_stands=&hfSA=&game_date_gt=${start_dt}&game_date_lt=${end_dt}&team=&position=&hfRO=&home_road=&hfFlag=&metric_1=&hfInn=&min_pitches=0&min_results=0&group_by=name&sort_col=pitches&player_event_sort=h_launch_speed&sort_order=desc&min_abs=0&type=details&`;

const TO_ISO_DATE = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function* seasonDates(season: number): Generator<string> {
    const today = new Date().setHours(0, 0, 0, 0);

    const start = new Date(season, 3 - 1, 15);
    const end = new Date(season, 11 - 1, 15);

    for (let date = new Date(start); date <= end && Number(date) < today; date.setDate(date.getDate() + 1)) {
        yield TO_ISO_DATE(date);
    }
}

async function getStatFromDB<T>(stat: CustomStat<T>, season: number, player: number, db: IDBPDatabase<StatcastDB>): Promise<T | undefined> {
    const cache: StatCache<T> | undefined = await db.get('stats', [season, stat.name]);

    if (cache === undefined) {
        return undefined;
    }

    return cache.by_player[String(player)];
}

async function recacheAllPlays(season: number, db: IDBPDatabase<StatcastDB>) {
    const all_dates = await db.getAllKeys('date');

    for (const date of seasonDates(season)) {
        if (!all_dates.includes(date)) {
            const result = await getDayFromURL(date);
            if (result !== null) {
                await db.put('date', result, date);
            }
        }
    }
}

async function getDayFromURL(date: string): Promise<string | null> {
    const result = await fetch(URL(date, date));
    if (!result.ok) {
        return null;
    }

    return result.text();
}

async function getDayFromDB(date: string, db: IDBPDatabase<StatcastDB>): Promise<Papa.ParseResult<StatcastRow>> {
    return Papa.parse(await db.get('date', date) ?? '', {
        header: true,
        dynamicTyping: true,
    });
}
