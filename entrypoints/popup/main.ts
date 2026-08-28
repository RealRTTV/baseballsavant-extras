import {getConfig, onConfigWrite, type ParsedConfig, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/extension/config.ts";
import {DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError, setTextareaConsoleSuccess} from "@/entrypoints/popup/textarea-helper.ts";
import {rerunStatcastDataCalculations, type StatcastDB} from "@/utils/extension/statcast.ts";
import {sendRerunStatcastDataCalculationsRequest} from "@/utils/shared/messages/rerun-statcast-data-calculations.ts";
import {openDB} from "idb";
import {getFileSizeForSeason} from "@/utils/extension/statcast-helper.ts";
import {createCalculatedSeason} from "@/entrypoints/popup/html-generation.ts";

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

    updateCachedSeasons().catch(console.error);
}

async function updateCachedSeasons() {
    const db = await openDB<StatcastDB>('statcast-data');

    const cachedSeasons: HTMLDivElement = document.querySelector('div#cached-seasons')! as HTMLDivElement;
    const children: HTMLElement[] = [];
    for (const season of getConfig().activeSeasons) {
        const fileSize = await getFileSizeForSeason(season, db);
        children.push(createCalculatedSeason(season, fileSize));
    }
    cachedSeasons.replaceChildren(...children);
}

setInterval(updateCachedSeasons, 1000);
