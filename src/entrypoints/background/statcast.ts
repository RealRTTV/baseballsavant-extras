import {type DBSchema, type IDBPDatabase, openDB} from 'idb';
import PQueue from "p-queue";
import {getConfig} from "@/utils/config.ts";
import {
    getDayBytesFromDB,
    getDayFromURL, getDaySubsidiaryBytesFromDB,
    getDaySubsidiaryFromURL,
    isEmptyDay,
    seasonDates
} from "@/entrypoints/background/statcast-helper.ts";
import {distributionDataJS, distributionDataWASM, getCustomStatForName, STAT_TO_FILENAME_MAP} from "@/entrypoints/background/custom-stats.ts";
import {
    type BaseCache,
    isJSCustomStat,
    isWASMCustomStat,
    type JSCustomStat,
    type WASMCustomStat
} from "@/utils/stats/custom_stats";

const TASK_QUEUE_QUEUE = new PQueue({ concurrency: 1 });
const TASK_QUEUE = new PQueue({ concurrency: 1 });

export let CURRENT_TASK_QUEUE_STATE: 'idle' | { downloadingSeason: number } | { calculatingStat: string, progressNumerator: number, progressDenominator: number } = 'idle';

/**
 * A queue for a queue (a little unnecessary)
 *
 * Pretty much the idea here is that we need a way to kill and restart partial statcast cache runs
 * without invalidating data by cancelling midway through a task.
 *
 * We split the atomic tasks (a day's cache, etc.) into a task array, which are then fed into the `TASK_QUEUE`.
 *
 * Then, to construct the generation of new tasks, we must wait until the active task is done.
 * Because multiple re-runs can be requested while the task is being completed,
 * we make a queue for the generation of tasks and do these generation runs one at a time.
 *
 * There's some additional optimization here to pause the `TASK_QUEUE` when doing a queue refresh.
 * Consider the case where multiple `rerunStatcastDataCalculations` calls are made shortly after eachother.
 * On each iteration of a task in the `TASK_QUEUE_QUEUE`, the `TASK_QUEUE` would be empty and once all the new tasks are added, it would begin executing.
 * Then the next task in `TASK_QUEUE_QUEUE` would need to wait for the running `TASK_QUEUE` task to complete.
 * Clearing the queue and inserting a new `TASK_QUEUE` tasklist, causing it to grab the first new task,
 * repeating the cycle of needing to wait for a task to finish.
 *
 * This has been solved by making the `TASK_QUEUE_QUEUE` pause the `TASK_QUEUE` until the `TASK_QUEUE_QUEUE` is complete;
 * effectively blocking the `TASK_QUEUE` while something is in the `TASK_QUEUE_QUEUE`.
 *
 * Another optimization is made to clear the `TASK_QUEUE_QUEUE` every time a new run is requested.
 * This way if 15 `rerunStatcastDataCalculations` runs are made during a `TASK_QUEUE` task,
 * only the one spin-looping on `await TASK_QUEUE.onIdle()` and the most recently queued one exist, since all `TASK_QUEUE_QUEUE` events are identical.
 *
 * Note: We should not not-add a `TASK_QUEUE_QUEUE` task if there is currently one executing because it could be midway through an `await getAllTasks()` call that is outdated due to outdated config values.
 * Leading to a different result from the newer `rerunStatcastDataCalculations` run.
 */
export async function rerunStatcastDataCalculations() {
    TASK_QUEUE.pause();
    TASK_QUEUE_QUEUE.clear();
    await TASK_QUEUE_QUEUE.add(async () => {
        TASK_QUEUE.clear();
        await TASK_QUEUE.onIdle();
        CURRENT_TASK_QUEUE_STATE = 'idle';
        TASK_QUEUE.addAll(
            (await getAllTasks())
                .map(task => async () => task()
                    .catch(err => console.error('An error occurred in a statcast task:', err.message ?? err))
                )
        ).then(_ => {});

        if (TASK_QUEUE_QUEUE.size === 0) {
            TASK_QUEUE.start();
        }
    });
}

async function getAllTasks(): Promise<(() => Promise<void>)[]> {
    const db = await createDB();

    return [
        async () => { await purgeOutdatedSubsidiaryCaches(db) },
        ...await createCacheStatcastDataTasks(db),
        ...createCalculateStatsTasks(db),
        async () => { CURRENT_TASK_QUEUE_STATE = 'idle'; },
    ];
}

export interface StatcastDB extends DBSchema {
    date: {
        key: string;
        value: Uint8Array<ArrayBuffer>;
    };
    dateSubsidiary: {
        key: string;
        value: Uint8Array<ArrayBuffer>;
    };
    season: {
        key: string;
        value: SeasonCache;
    };
    stats: {
        key: [number, string];
        value: BaseCache<any>;
    };
}

type SeasonCache = {
    fileSize: number,
    cachedDates: string[]
    cachedSubsidiaryDates: string[],
    cachedSubsidiaryVersion: number | undefined,
};

export const DISTRIBUTION_METRICS: Record<string, { mean: number, stdev: number, qual: number }> = {};

export async function createDB(): Promise<IDBPDatabase<StatcastDB>> {
    return openDB<StatcastDB>('statcast-data', 1, {
        upgrade(db) {
            db.createObjectStore('date');
            db.createObjectStore('dateSubsidiary');
            db.createObjectStore('season');
            db.createObjectStore('stats');
        }
    });
}

let __CURRENT_SUBSIDIARY_CSV_VERSION: number | undefined = undefined;
let __LAST_UPDATED_CURRENT_SUBSIDIARY_CSV_VERSION: number | undefined = undefined;
async function getCurrentSubsidiaryVersion(): Promise<number | undefined> {
    if (__CURRENT_SUBSIDIARY_CSV_VERSION === undefined || __LAST_UPDATED_CURRENT_SUBSIDIARY_CSV_VERSION === undefined || (__LAST_UPDATED_CURRENT_SUBSIDIARY_CSV_VERSION <= Date.now() - 60_000)) {
        let version: number | undefined = Number(await (await fetch("https://rttv.ca/statcast-subsidiary-csv/version")).text());
        if (!Number.isFinite(version)) {
            version = undefined;
        }
        __CURRENT_SUBSIDIARY_CSV_VERSION = version;
        __LAST_UPDATED_CURRENT_SUBSIDIARY_CSV_VERSION = Date.now();
    }

    return __CURRENT_SUBSIDIARY_CSV_VERSION;
}

async function purgeOutdatedSubsidiaryCaches(db: IDBPDatabase<StatcastDB>) {
    const version = await getCurrentSubsidiaryVersion();

    for (const season of getConfig().activeSeasons) {
        const cache = await getSeasonCache(season, db);
        if (version === undefined || cache.cachedSubsidiaryVersion === undefined || cache.cachedSubsidiaryVersion >= version) {
            continue;
        }

        let stats = await db.getAllKeys('stats', IDBKeyRange.bound([season], [season, []]));
        for (const key of stats) {
            const cache = await db.get('stats', key);
            if (cache?.uses_subsidiary_csv) {
                await db.delete('stats', key);
            }
        }

        for (const date in seasonDates(season)) {
            await db.delete('dateSubsidiary', date);
        }

        cache.cachedSubsidiaryDates = [];
        cache.cachedSubsidiaryVersion = version;
        await db.put('season', cache, String(season));
    }
}

async function createCacheStatcastDataTasks(db: IDBPDatabase<StatcastDB>): Promise<(() => Promise<void>)[]> {
    const tasks = [];
    for (const season of getConfig().activeSeasons) {
        tasks.push(async () => { CURRENT_TASK_QUEUE_STATE = { downloadingSeason: season } });
        tasks.push(...await createDayCacheTasks(season, db));
        tasks.push(...await createDaySubsidiaryCacheTasks(season, db));
    }
    return tasks;
}

async function calculateJSCustomStat<T extends object, Cache extends BaseCache<T> = BaseCache<T>>(stat: JSCustomStat<T, Cache>, season: number, db: IDBPDatabase<StatcastDB>): Promise<void> {
    console.log(`[JS] Calculating ${stat.property.value} for ${season}...`);

    const cache: Cache = (await db.get('stats', [season, stat.property.value])) as Cache ?? await stat.create_cache();
    const newDates = seasonDates(season).filter(date => !cache.cached_dates.includes(date)).toArray();
    let numComplete = 0;
    const setState = () => {
        CURRENT_TASK_QUEUE_STATE = {
            calculatingStat: STAT_TO_FILENAME_MAP[stat.property.value] ?? '',
            progressNumerator: numComplete,
            progressDenominator: newDates.length,
        };
    }

    setState();

    if (newDates.length > 0) {
        await stat.on_incremental(cache);
        cache.qualification_threshold = undefined;

        do {
            for (const date of newDates) {
                const bytes = await getDayBytesFromDB(date, db);
                if (isEmptyDay(bytes)) {
                    numComplete += 1;
                    setState();
                    continue
                }

                let subsidiaryBytes = stat.property.wants_subsidiary_csv ? await getDaySubsidiaryBytesFromDB(date, db) : null;
                if (stat.property.wants_subsidiary_csv && subsidiaryBytes !== null && isEmptyDay(subsidiaryBytes)) {
                    numComplete += 1;
                    setState();
                    continue;
                }
                await stat.apply(cache, bytes, subsidiaryBytes);
                cache.cached_dates.push(date);
                await db.put('stats', cache, [season, stat.property.value]);
                numComplete += 1;
                setState();
            }
        } while (await stat.on_finish_apply(cache) === 'rerun');
    }

    DISTRIBUTION_METRICS[`${season}:${stat.property.value}`] = await distributionDataJS(stat, cache);
    console.log(stat.property.value, DISTRIBUTION_METRICS[`${season}:${stat.property.value}`]);

    console.log(`[JS] Calculated ${stat.property.value} for ${season}`);
}

async function calculateWASMCustomStat<T extends object, Cache extends BaseCache<T> = BaseCache<T>>(stat: WASMCustomStat<T, Cache>, season: number, db: IDBPDatabase<StatcastDB>): Promise<void> {
    const start = performance.now();
    console.log(`[WASM] Calculating ${stat.property.value} for ${season}...`);

    const cacheInDB: Cache | undefined = await db.get('stats', [season, stat.property.value]) as Cache | undefined;
    const cachedDates = cacheInDB?.cached_dates ?? [];

    const newDates = seasonDates(season).filter(date => !cachedDates.includes(date)).toArray();

    let numComplete = 0;
    const setState = () => {
        CURRENT_TASK_QUEUE_STATE = {
            calculatingStat: STAT_TO_FILENAME_MAP[stat.property.value] ?? '',
            progressNumerator: numComplete,
            progressDenominator: newDates.length,
        };
    }

    setState();

    if (newDates.length > 0) {
        if (cacheInDB) cacheInDB.qualification_threshold = undefined;
        stat.deserialize_cache(cacheInDB);
        stat.on_incremental();

        do {
            for (const date of newDates) {
                const bytes = await getDayBytesFromDB(date, db);
                if (isEmptyDay(bytes)) {
                    numComplete += 1;
                    setState();
                    continue;
                }
                let subsidiaryBytes = stat.property.wants_subsidiary_csv ? await getDaySubsidiaryBytesFromDB(date, db) : null;
                if (stat.property.wants_subsidiary_csv && subsidiaryBytes !== null && isEmptyDay(subsidiaryBytes)) {
                    numComplete += 1;
                    setState();
                    continue;
                }
                stat.apply(bytes, subsidiaryBytes);
                const cache = stat.serialize_cache();
                cache.cached_dates.push(date);
                stat.deserialize_cache(cache);
                await db.put('stats', cache, [season, stat.property.value]);
                numComplete += 1;
                setState();
            }
        } while (stat.on_finish_apply() === 'rerun');
    }

    const cache = stat.serialize_cache();
    DISTRIBUTION_METRICS[`${season}:${stat.property.value}`] = distributionDataWASM(stat, cache);
    console.log(stat.property.value, DISTRIBUTION_METRICS[`${season}:${stat.property.value}`]);
    await db.put('stats', cache, [season, stat.property.value]);

    const end = performance.now();
    console.log(`[WASM] Calculated ${stat.property.value} for ${season} in ${end - start}ms`);

}

function createCalculateStatsTasks(db: IDBPDatabase<StatcastDB>): (() => Promise<void>)[] {
    const tasks = [];
    for (const stat of getConfig().activeStats) {
        for (const season of getConfig().activeSeasons) {
            tasks.push(async () => {
                const statInstance = getCustomStatForName(stat.value)!;
                if (isJSCustomStat(statInstance)) {
                    await calculateJSCustomStat(statInstance, season, db);
                } else if (isWASMCustomStat(statInstance)) {
                    await calculateWASMCustomStat(statInstance, season, db);
                }
            });
        }
    }
    return tasks;
}

function isInFinalState(date_string: string): boolean {
    const date = new Date(date_string);
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    return date <= fiveDaysAgo;
}

async function getSeasonCache(season: number, db: IDBPDatabase<StatcastDB>): Promise<SeasonCache> {
    let result = await db.get('season', String(season));
    if (result === undefined) {
        let subsidiaryVersion = await getCurrentSubsidiaryVersion();
        if (subsidiaryVersion === undefined) {
            console.error("Failed to get subsidiary version number. This is very bad; we will assume a version of 0, but this will invalidate the cache on the next successful request.");
        }
        result = { fileSize: 0, cachedDates: [], cachedSubsidiaryDates: [], cachedSubsidiaryVersion: subsidiaryVersion };
        await db.put('season', result, String(season));
    }
    return result;
}

async function createDayCacheTasks(season: number, db: IDBPDatabase<StatcastDB>): Promise<(() => Promise<void>)[]> {
    const cachedDates = (await getSeasonCache(season, db)).cachedDates;

    return Array.from(seasonDates(season).filter(date => !cachedDates.includes(date)).map(date => async () => {
        const result = await getDayFromURL(date);

        if (result !== null || isInFinalState(date)) {
            if (result !== null) {
                await db.put('date', result, date);
            }

            const seasonData = await getSeasonCache(season, db);
            seasonData.fileSize += result?.length ?? 0;
            seasonData.cachedDates.push(date);
            await db.put('season', seasonData, String(season));
        }
    }))
}

async function createDaySubsidiaryCacheTasks(season: number, db: IDBPDatabase<StatcastDB>): Promise<(() => Promise<void>)[]> {
    const cachedDates = (await getSeasonCache(season, db)).cachedSubsidiaryDates;

    return Array.from(seasonDates(season).filter(date => !cachedDates.includes(date)).map(date => async () => {
        const result = await getDaySubsidiaryFromURL(date);

        if (result !== null || isInFinalState(date)) {
            if (result !== null) {
                await db.put('dateSubsidiary', result, date);
            }

            const seasonData = await getSeasonCache(season, db);
            seasonData.fileSize += result?.length ?? 0;
            seasonData.cachedSubsidiaryDates.push(date);
            await db.put('season', seasonData, String(season));
        }
    }))
}
