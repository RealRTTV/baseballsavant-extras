import {onConfigWrite, type ParsedConfig, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/config.ts";
import {DEFAULT_CONFIG} from "@/utils/config-consts.ts";
import {setTextareaConsoleError, setTextareaConsoleSuccess} from "@/entrypoints/sidepanel/textarea-helper.ts";
import {type StatcastDB} from "@/entrypoints/background/statcast.ts";
import {requestRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {openDB} from "idb";
import {getCachedSeasons, getFileSizeForSeason} from "@/entrypoints/background/statcast-helper.ts";
import {createCalculatedSeason} from "@/entrypoints/sidepanel/html-generation.ts";

export async function onConfigInput(textarea: HTMLTextAreaElement) {
    try {
        const config = await onConfigWrite(textarea.value);
        onConfig(config);
        setTextareaConsoleSuccess();
    } catch (e: any) {
        setTextareaConsoleError(e.message);
    }
}

SAVANT_EXTRAS_CONFIG_STRING.getValue().then(async CONFIG_STRING => {
    const textarea: HTMLTextAreaElement | null = document.querySelector('textarea#config-textarea')! as HTMLTextAreaElement;
    const CONFIG = CONFIG_STRING || DEFAULT_CONFIG;

    if (textarea !== null) {
        textarea.value = CONFIG;
        await onConfigInput(textarea);
        textarea.addEventListener('input', async _ => onConfigInput(textarea));
    }
});

function onConfig(_config: ParsedConfig) {
    requestRerunStatcastDataCalculations();
}

function initEnableUserScripts() {
    const title = document.querySelector('#custom-stats-title')!;
    title.addEventListener('mousedown', async () => {
        console.log('Requesting user-scripts permission...');
        await browser.permissions.request({ permissions: ['userScripts'] });
    });
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
    })
    customStats.addEventListener('drop', async e => {
        e.preventDefault();
        customStats.classList.remove('is-dragging');
        const files = e.dataTransfer?.files!;
        for (const file of files) {
            console.log(await file.text());
        }
    })
}

async function updateCachedSeasons(fetchFileSizes: boolean) {
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
}

initEnableUserScripts();
initDragAndDrop();
updateCachedSeasons(false).then(_ => updateCachedSeasons(true));
setInterval(() => updateCachedSeasons(true), 1000);
