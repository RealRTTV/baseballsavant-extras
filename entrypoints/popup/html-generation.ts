import { prettyPrintFileSize } from "@/utils/shared/files";

export function createCalculatedYear(year: number, file_size?: number): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'calculated-year';
    div.innerHTML = `
<span class="calculated-year-year">${year}</span>
<span class="calculated-year-file-size">${prettyPrintFileSize(file_size ?? 0)}</span>
<span class="calculated-year-purge">Purge</span>
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
