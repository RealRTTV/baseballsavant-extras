import { prettyPrintFileSize } from "@/utils/shared/files";
import {purgeSeason} from "@/utils/extension/statcast-helper.ts";
import type {StatcastDB} from "@/utils/extension/statcast.ts";
import {openDB} from "idb";
import {sendRerunStatcastDataCalculationsRequest} from "@/utils/shared/messages/rerun-statcast-data-calculations.ts";

async function onPurge(season: number, div: HTMLDivElement): Promise<void> {
    const db = await openDB<StatcastDB>('statcast-data');
    await purgeSeason(season, db);
    div.remove();
    sendRerunStatcastDataCalculationsRequest();
}

export function createCalculatedSeason(season: number, file_size?: number): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'cached-season';
    div.innerHTML = `
<span class="cached-season-year">${season}</span>
<span class="cached-season-file-size">${file_size === undefined ? '- - - . - MB' : prettyPrintFileSize(file_size)}</span>
<span class="cached-season-purge">Purge</span>
    `;
    const purgeButton: HTMLSpanElement = div.querySelector('span.cached-season-purge')!;
    purgeButton.addEventListener('mousedown', async () => await onPurge(season, div))
    return div;
}

export function createCustomStatEntry(name: string): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'custom-stat-entry';
    div.innerHTML = `
<span class="custom-stats-entry-name" title="${name}">${name}</span>
<div class="delete-button">&times;</div>
    `;
    return div;
}
