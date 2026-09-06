import {initConfig, onConfigWrite, type ParsedConfig, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/config.ts";
import {DEFAULT_CONFIG} from "@/utils/config-consts.ts";
import {
    setTextareaConsoleError,
    setTextareaConsoleSuccess
} from "@/entrypoints/sidepanel/html-helper.ts";
import {CURRENT_TASK_QUEUE_STATE, type StatcastDB} from "@/entrypoints/background/statcast.ts";
import {requestRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {openDB} from "idb";
import {getCachedSeasons, getFileSizeForSeason} from "@/entrypoints/background/statcast-helper.ts";
import {createCalculatedSeason, createCustomStatsEntry} from "@/entrypoints/sidepanel/html-generation.ts";
import {addCustomStat, CUSTOM_STATS_STORAGE, refreshCustomStats, STAT_TO_FILENAME_MAP} from "@/utils/custom-stats.ts";
import {requestStatcastCalculationsState} from "@/utils/messages/statcast-calculations-state.ts";
import {prettyPrintFileSize} from "@/utils/files.ts";

export function onConfigInput(textarea: HTMLTextAreaElement) {
    try {
        const config = onConfigWrite(textarea.value);
        onConfig(config);
        setTextareaConsoleSuccess();
    } catch (e: any) {
        setTextareaConsoleError(e.message);
    }
}

function onConfig(_config: ParsedConfig) {
    requestRerunStatcastDataCalculations();
}

function initDragAndDrop() {
    const customStats: HTMLDivElement = document.querySelector('div#custom-stats')!;
    customStats.addEventListener('dragover', e => {
        e.preventDefault();
        customStats.classList.add('is-dragging');
    });
    customStats.addEventListener('dragleave', e => {
        e.preventDefault();
        customStats.classList.remove('is-dragging');
    });
    customStats.addEventListener('drop', async e => {
        e.preventDefault();
        customStats.classList.remove('is-dragging');
        const files = e.dataTransfer?.files!;
        for (const file of files) {
            await addCustomStat(file.name, await file.text());
        }
    });

    const customStatsEntries: HTMLDivElement = customStats.querySelector('div#custom-stats-entries')!;
    CUSTOM_STATS_STORAGE.getValue().then(map => {
        customStatsEntries.replaceChildren(...Object.keys(map).map(createCustomStatsEntry));
    });
    CUSTOM_STATS_STORAGE.watch(map => {
        customStatsEntries.replaceChildren(...Object.keys(map).map(createCustomStatsEntry));
    });
}

function getCachedSeasonForYear(cachedSeasons: HTMLDivElement, season: number): Element | undefined {
    return Array.from(cachedSeasons.children).find(child => getYearForCachedSeason(child) === season);
}

function getYearForCachedSeason(cachedSeason: Element): number {
    return Number(cachedSeason.querySelector('.cached-season-year')?.firstChild?.textContent?.trim());
}

function getFirstLessThanCachedSeasonForYear(cachedSeasons: HTMLDivElement, season: number): Element | undefined {
    return Array.from(cachedSeasons.children).find(child => getYearForCachedSeason(child) < season);
}

async function updateCachedSeasons(fetchFileSizes: boolean) {
    const statePromise = requestStatcastCalculationsState();
    await updateCachedSeasonFileSizes(fetchFileSizes);
    await updateLoadingAnimations(statePromise);
}

// this would be way easier if we didn't have to keep the animations smooth between refreshes
async function updateCachedSeasonFileSizes(fetchFileSizes: boolean) {
    const db = await openDB<StatcastDB>('statcast-data');
    const seasons = await getCachedSeasons(db);
    seasons.sort((a, b) => b - a);

    const cachedSeasons: HTMLDivElement = document.querySelector('div#cached-seasons')! as HTMLDivElement;

    const fileSizesBySeason = await Promise.all(seasons.map(async season => {
        return [season, fetchFileSizes ? await getFileSizeForSeason(season, db) : undefined] as [number, number | undefined];
    }));

    for (const child of cachedSeasons.children) {
        if (!seasons.includes(getYearForCachedSeason(child))) {
            child.remove();
        }
    }

    for (const [season, fileSize] of fileSizesBySeason) {
        const cachedSeason = getCachedSeasonForYear(cachedSeasons, season);
        if (cachedSeason !== undefined) {
            cachedSeason.querySelector('.cached-season-file-size')!.innerHTML = (fileSize === undefined ? '- - - . - MB' : prettyPrintFileSize(fileSize));
        } else {
            const newCachedSeason = createCalculatedSeason(season, fileSize);
            const lessThan = getFirstLessThanCachedSeasonForYear(cachedSeasons, season);
            if (lessThan === undefined) {
                cachedSeasons.appendChild(newCachedSeason);
            } else {
                lessThan.before(newCachedSeason);
            }
        }
    }
}

async function updateLoadingAnimations(statePromise: Promise<typeof CURRENT_TASK_QUEUE_STATE>) {
    const state = await statePromise;
    document.querySelectorAll('.section-border-loading-animation-rect').forEach(e => e.classList.remove('is-loading'));
    if (state === 'idle') {
        // do nothing
    } else if ('downloadingSeason' in state) {
        const season = state.downloadingSeason;
        const cachedSeasons: HTMLDivElement = document.querySelector('div#cached-seasons')!;
        const element = getCachedSeasonForYear(cachedSeasons, season);
        element?.querySelector('.section-border-loading-animation-rect')?.classList.add('is-loading');
    } else if ('calculatingStat' in state) {
        const stat = state.calculatingStat;
        const filename = STAT_TO_FILENAME_MAP[stat] ?? '';
        const elements = Array.from(document.querySelectorAll('.custom-stats-entry-wrapper'));
        const element = elements.find(e => e.querySelector('.custom-stats-entry-name')!.innerHTML === filename);
        element?.querySelector('.section-border-loading-animation-rect')?.classList.add('is-loading');
    }
}

(async () => {
    await refreshCustomStats();
    SAVANT_EXTRAS_CONFIG_STRING.getValue().then(CONFIG_STRING => {
        const textarea: HTMLTextAreaElement | null = document.querySelector('textarea#config-textarea')! as HTMLTextAreaElement;
        const CONFIG = CONFIG_STRING || DEFAULT_CONFIG;

        if (textarea !== null) {
            textarea.value = CONFIG;
            onConfigInput(textarea);
            textarea.addEventListener('input', _ => onConfigInput(textarea));
        }
    });
    await initConfig();
    initDragAndDrop();
    updateCachedSeasons(false).then(_ => updateCachedSeasons(true));
    setInterval(() => updateCachedSeasons(true), 1000);
})()
