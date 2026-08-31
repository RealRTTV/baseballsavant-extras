import {getConfig, onConfigWrite, type ParsedConfig, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/extension/config.ts";
import {DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError, setTextareaConsoleSuccess} from "@/entrypoints/sidepanel/textarea-helper.ts";
import {rerunStatcastDataCalculations, type StatcastDB} from "@/utils/extension/statcast.ts";
import {sendRerunStatcastDataCalculationsRequest} from "@/utils/shared/messages/rerun-statcast-data-calculations.ts";
import {openDB} from "idb";
import {getCachedSeasons, getFileSizeForSeason} from "@/utils/extension/statcast-helper.ts";
import {createCalculatedSeason} from "@/entrypoints/sidepanel/html-generation.ts";

export function onConfigInput(textarea: HTMLTextAreaElement) {
    try {
        const config = onConfigWrite(textarea.value);
        onConfig(config);
        setTextareaConsoleSuccess();
    } catch (e: any) {
        setTextareaConsoleError(e.message);
    }
}

SAVANT_EXTRAS_CONFIG_STRING.getValue().then(CONFIG_STRING => {
    const textarea: HTMLTextAreaElement | null = document.querySelector('textarea#config-textarea')! as HTMLTextAreaElement;
    const CONFIG = CONFIG_STRING || DEFAULT_CONFIG;

    if (textarea !== null) {
        textarea.value = CONFIG;
        onConfigInput(textarea);
        textarea.addEventListener('input', _ => onConfigInput(textarea));
    }
});

function onConfig(_config: ParsedConfig) {
    sendRerunStatcastDataCalculationsRequest();
}

function setupDragAndDrop() {
    const customStats: HTMLDivElement = document.querySelector('div#custom-stats')!;
    customStats.addEventListener('dragover', e => {
        e.preventDefault();
        customStats.classList.add('is-dragging');
    });
    customStats.addEventListener('dragleave', e => {
        e.preventDefault();
        customStats.classList.remove('is-dragging');
    })
    customStats.addEventListener('drop', e => {
        e.preventDefault();
        customStats.classList.remove('is-dragging');
        const files = e.dataTransfer?.files!;
        console.log(files);
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

setupDragAndDrop();
await updateCachedSeasons(false);
await updateCachedSeasons(true);
setInterval(() => updateCachedSeasons(true), 1000);
