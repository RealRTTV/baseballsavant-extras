import Papa from 'papaparse';

import {type DBSchema, type IDBPDatabase, openDB} from 'idb';
import PQueue from "p-queue";
import {distributionData} from "@/utils/shared/stats/custom_stats";
import {getConfig} from "@/utils/extension/config.ts";
import {getDayFromDB, getDayFromURL, seasonDates} from "@/utils/extension/statcast-helper.ts";

const TASK_QUEUE_QUEUE = new PQueue({ concurrency: 1 });
const TASK_QUEUE = new PQueue({ concurrency: 1 });

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
export function rerunStatcastDataCalculations() {
    TASK_QUEUE.pause();
    TASK_QUEUE_QUEUE.clear();
    TASK_QUEUE_QUEUE.add(async () => {
        TASK_QUEUE.clear();
        await TASK_QUEUE.onIdle();
        TASK_QUEUE.addAll(await getAllTasks()).then(_ => {});

        if (TASK_QUEUE_QUEUE.size === 0) {
            TASK_QUEUE.start();
        }
    }).then(_ => {});
}

async function getAllTasks() {
    const db = await createDB();

    return [
        ...await createCacheStatcastDataTasks(db),
        ...createCalculateStatsTasks(db),
    ];
}

export interface StatcastDB extends DBSchema {
    date: {
        key: string;
        value: string;
    };
    stats: {
        key: [number, string];
        value: StatCache<any>;
    };
}

export type StatCache<T> = {
    cachedDates: string[],
    byPlayer: Record<string, T>,
}

export const DISTRIBUTION_METRICS: Record<string, [number, number]> = {};

async function createDB(): Promise<IDBPDatabase<StatcastDB>> {
    return openDB<StatcastDB>('statcast-data', 1, {
        upgrade(db) {
            db.createObjectStore('date');
            db.createObjectStore('stats');
        }
    });
}

async function createCacheStatcastDataTasks(db: IDBPDatabase<StatcastDB>): Promise<(() => Promise<void>)[]> {
    const tasks = [];
    for (const season of getConfig().activeYears) {
        tasks.push(...await createDayCacheTasks(season, db));
    }
    return tasks;
}

function createCalculateStatsTasks(db: IDBPDatabase<StatcastDB>): (() => Promise<void>)[] {
    const tasks = [];
    for (const stat of getConfig().activeStats) {
        for (const season of getConfig().activeYears) {
            tasks.push(async () => {
                console.log(`Calculating ${stat.property.value} for ${season}...`);

                const cache: StatCache<any> | undefined = (await db.get('stats', [season, stat.property.value])) ?? { cachedDates: [], byPlayer: {} };

                const newDates = seasonDates(season).filter(date => !cache.cachedDates.includes(date)).toArray();
                if (newDates.length === 0) {
                    return;
                }

                for (const date of newDates) {
                    const data = await getDayFromDB(date, db);
                    stat.apply(data.data.filter(r => r.game_type === 'R'), cache.byPlayer);
                }
                cache.cachedDates.push(...newDates);

                DISTRIBUTION_METRICS[`${season}:${stat.property.value}`] = distributionData(stat, cache.byPlayer);

                await db.put('stats', cache, [season, stat.property.value]);
            });
        }
    }
    return tasks;
}

async function createDayCacheTasks(season: number, db: IDBPDatabase<StatcastDB>): Promise<(() => Promise<void>)[]> {
    const allDates = await db.getAllKeys('date');

    return Array.from(seasonDates(season).filter(date => !allDates.includes(date)).map(date => async () => {
        console.log(date);
        const result = await getDayFromURL(date);
        if (result !== null) {
            await db.put('date', result, date);
        }
    }))
}
