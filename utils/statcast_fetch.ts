import Papa from 'papaparse';

import {type IDBPDatabase, openDB} from 'idb';
import type {StatcastRow} from "@/utils/statcast_row.ts";

const ENABLED_SEASONS: Array<number> = [
    'current'
].map(entry => entry.toLowerCase() === 'current' ? new Date().getFullYear() : Number(entry));

export async function statcastCustomStats() {
    const db = await openDB('statcast-data', 1, {
        upgrade(db) {
            db.createObjectStore('date')
        }
    })

    for (const season of ENABLED_SEASONS) {
        await updateStatcastData(season, db);
    }

    console.log('Finished parsing statcast data');

    const date: Papa.ParseResult<StatcastRow> = (await dates(2026, db).next()).value;
    document.statcastDate = date.data;
}

const STATCAST_SMALL_REQUEST: (start_dt: string, end_dt: string) => string = (start_dt, end_dt) => `https://baseballsavant.mlb.com/statcast_search/csv?all=true&hfPT=&hfAB=&hfBBT=&hfPR=&hfZ=&stadium=&hfBBL=&hfNewZones=&hfGT=R%7CPO%7CS%7C=&hfSea=&hfSit=&player_type=pitcher&hfOuts=&opponent=&pitcher_throws=&batter_stands=&hfSA=&game_date_gt=${start_dt}&game_date_lt=${end_dt}&team=&position=&hfRO=&home_road=&hfFlag=&metric_1=&hfInn=&min_pitches=0&min_results=0&group_by=name&sort_col=pitches&player_event_sort=h_launch_speed&sort_order=desc&min_abs=0&type=details&`;

const TO_ISO_DATE = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function* seasonDates(season: number): Generator<string> {
    const today = new Date().setHours(0, 0, 0, 0);

    const start = new Date(season, 3 - 1, 15);
    const end = new Date(season, 11 - 1, 15);

    for (let date = new Date(start); date <= end && Number(date) < today; date.setDate(date.getDate() + 1)) {
        yield TO_ISO_DATE(date);
    }
}

async function updateStatcastData(season: number, db: IDBPDatabase) {
    const all_dates = await db.getAllKeys('date');

    for (const date of seasonDates(season)) {
        if (!all_dates.includes(date)) {
            const result = await getStatcastData(date);
            if (result !== null) {
                await db.put('date', result, date);
            }
        }
    }
}

async function getStatcastData(date: string): Promise<string | null> {
    const result = await fetch(STATCAST_SMALL_REQUEST(date, date));
    if (result.status != 200) {
        return null;
    }

    return result.text();
}

async function* dates(season: number, db: IDBPDatabase): AsyncGenerator<Papa.ParseResult<StatcastRow>> {
    for (const date of seasonDates(season)) {
        const entry = await db.get('date', date);
        if (entry !== undefined) {
            yield Papa.parse(entry, {
                header: true,
                dynamicTyping: true,
            });
        }
    }
}
