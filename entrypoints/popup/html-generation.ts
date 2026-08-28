import { prettyPrintFileSize } from "@/utils/shared/files";

export function createCalculatedSeason(season: number, file_size?: number): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'cached-season';
    div.innerHTML = `
<span class="cached-season-year">${season}</span>
<span class="cached-season-file-size">${prettyPrintFileSize(file_size ?? 0)}</span>
<span class="cached-season-purge">Purge</span>
    `;
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
