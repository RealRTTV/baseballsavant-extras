export function prettyPrintFileSize(b: number): string {
    if (b < 1_000) {
        return `${b} B`;
    }

    const kb = b / 1000;
    if (kb < 1000) {
        return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1000;
    if (mb < 1000) {
        return `${mb.toFixed(1)} MB`;
    }

    const gb = mb / 1000;
    if (gb < 1000) {
        return `${gb.toFixed(1)} GB`;
    }

    const tb = gb / 1000;
    return `${tb.toFixed(1)} TB`;
}
