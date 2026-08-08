import Papa from 'papaparse';

import {type IDBPDatabase, type DBSchema, openDB} from 'idb';
import type {StatcastRow} from "@/utils/statcast_row.ts";
import {type CustomStat, FIRST_PITCH_STRIKE, distributionData} from "@/utils/custom_stats";
import {qualifiedPitchers} from "@/utils/statsapi_fetch.ts";

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

type StatCache<T extends CustomStat<T>> = {
    cached_dates: string[],
    by_player: Record<string, T>,
}

const ENABLED_SEASONS: Array<number> = [
    'current'
].map(entry => entry.toLowerCase() === 'current' ? new Date().getFullYear() : Number(entry));

const STATS: Array<CustomStat<any>> = [
    FIRST_PITCH_STRIKE,
];

export async function statcastCustomStats() {
    const db = await openDB<StatcastDB>('statcast-data', 1, {
        upgrade(db) {
            db.createObjectStore('date');
            db.createObjectStore('stats');
        }
    });

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

            const cache = (await db.get('stats', [season, stat.name])) ?? { cached_dates: [], by_player: {} };

            const new_dates = seasonDates(season).filter(date => !cache.cached_dates.includes(date)).toArray();

            for (const date of new_dates) {
                const data = await getFromDB(date, db);
                stat.apply(data.data.filter(r => r.game_type === 'R'), cache.by_player);
            }
            cache.cached_dates.push(...new_dates);

            console.log(cache);
            console.log(distributionData(stat, cache.by_player, qualifiedPitchersBySeason[season] ?? new Set()));

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

async function recacheAllPlays(season: number, db: IDBPDatabase<StatcastDB>) {
    const all_dates = await db.getAllKeys('date');

    for (const date of seasonDates(season)) {
        if (!all_dates.includes(date)) {
            const result = await getFromURL(date);
            if (result !== null) {
                await db.put('date', result, date);
            }
        }
    }
}

async function getFromURL(date: string): Promise<string | null> {
    const result = await fetch(URL(date, date));
    if (!result.ok) {
        return null;
    }

    return result.text();
}

async function getFromDB(date: string, db: IDBPDatabase<StatcastDB>): Promise<Papa.ParseResult<StatcastRow>> {
    return Papa.parse(await db.get('date', date) ?? '', {
        header: true,
        dynamicTyping: true,
    });
}
