const PERCENTILE_RANKINGS_SPEC = /(?:^|[\s,;{(=])([A-Za-z_$][\w$]*)\s*=\s*\{\s*batterValue\s*:\s*\{\s*props\s*:/;

export function patchPercentileRankingsSpec(src: string): string {
    const match = src.match(PERCENTILE_RANKINGS_SPEC);

    if (match === null) {
        throw new Error(`anchor missed: PERCENTILE_RANKINGS_SPEC=${!!PERCENTILE_RANKINGS_SPEC} not found.`);
    }

    const varName = match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const line = new RegExp(`Object\\.keys\\(${varName}\\)\\.forEach\\(`);

    if (!line.test(src)) {
        throw new Error("second anchor missed.");
    }

    return src.replace(line, hit => `typeof __savantExtras!=="undefined"&&__savantExtras.onSpec(${varName}),${hit}`)
}