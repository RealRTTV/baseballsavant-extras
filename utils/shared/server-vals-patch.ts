export type ServerValsPatch = {
    playerId: number,
    patches: StatPatch[],
    summaryPatches: SummaryPatch[],
    forceDisplayPatches: ForceDisplayPatch[]
};

export type StatPatch = {
    season: number,
    key: string,
    value: number | null,
    percentile: number | null,
};

export type SummaryPatch = {
    metric: string,
    avg_metric: number,
    stddev_metric: number,
    n: number,
    season: number,
};

export type ForceDisplayPatch = {
    metric: string,
}
