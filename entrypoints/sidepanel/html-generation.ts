import { prettyPrintFileSize } from "@/utils/files";
import {purgeSeason} from "@/entrypoints/background/statcast-helper.ts";
import type {StatcastDB} from "@/entrypoints/background/statcast.ts";
import {openDB} from "idb";
import {requestRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {removeCustomStatFile} from "@/utils/custom-stats.ts";

async function onPurge(season: number, div: HTMLDivElement): Promise<void> {
    const db = await openDB<StatcastDB>('statcast-data');
    await purgeSeason(season, db);
    div.remove();
    requestRerunStatcastDataCalculations();
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
    purgeButton.addEventListener('mouseup', async () => await onPurge(season, div))
    return div;
}

export function createCustomStatsEntry(filename: string): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'custom-stats-entry';
    div.innerHTML = `
<span class="custom-stats-entry-name" title="${filename}">${filename}</span>
<span class="delete-button">&times;</span>
    `;
    const deleteButton: HTMLSpanElement = div.querySelector('span.delete-button')!;
    deleteButton.addEventListener('mouseup', async () => await removeCustomStatFile(filename));
    return div;
}
