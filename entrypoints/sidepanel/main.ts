import {initConfig, onConfigWrite, type ParsedConfig, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/config.ts";
import {DEFAULT_CONFIG} from "@/utils/config-consts.ts";
import {
    disableLoadingAnimation,
    enableLoadingAnimation,
    setTextareaConsoleError,
    setTextareaConsoleSuccess
} from "@/entrypoints/sidepanel/html-helper.ts";
import {type StatcastDB} from "@/entrypoints/background/statcast.ts";
import {requestRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {openDB} from "idb";
import {getCachedSeasons, getFileSizeForSeason} from "@/entrypoints/background/statcast-helper.ts";
import {createCalculatedSeason, createCustomStatsEntry} from "@/entrypoints/sidepanel/html-generation.ts";
import {CUSTOM_STATS_STORAGE, refreshCustomStats} from "@/utils/custom-stats.ts";
import {isToggleLoadingAnimation} from "@/utils/messages/toggle-loading-animation.ts";
import {requestStatcastCalculationsState} from "@/utils/messages/statcast-calculations-state.ts";

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
            console.log(await file.text());
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

async function updateCachedSeasons(fetchFileSizes: boolean) {
    const statePromise = requestStatcastCalculationsState();
    const db = await openDB<StatcastDB>('statcast-data');
    const seasons = await getCachedSeasons(db);
    seasons.sort((a, b) => b - a);

    const cachedSeasons: HTMLDivElement = document.querySelector('div#cached-seasons')! as HTMLDivElement;
    const children: HTMLElement[] = [];
    for (const season of seasons) {
        const fileSize = fetchFileSizes ? await getFileSizeForSeason(season, db) : undefined;
        children.push(createCalculatedSeason(season, fileSize));
    }
    cachedSeasons.replaceChildren(...children);

    const state = await statePromise;
    disableLoadingAnimation('#cached-seasons-loading-animation');
    disableLoadingAnimation('#custom-stats-loading-animation');
    if (state === 'idle') {
        // do nothing
    } else if (state === 'downloading') {
        enableLoadingAnimation('#cached-seasons-loading-animation');
    } else {
        enableLoadingAnimation('#custom-stats-loading-animation');
    }
}

function initMessageHandler() {
    browser.runtime.onMessage.addListener((message, _, _sendResponse) => {
        if (isToggleLoadingAnimation(message)) {
            if (message.state ?? false) {
                enableLoadingAnimation(message.selector);
            } else {
                disableLoadingAnimation(message.selector);
            }
        }
    })
}

(async () => {
    initMessageHandler();
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
