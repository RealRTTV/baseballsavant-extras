export type ServerValsPatch = {
    playerId: number,
    patches: StatPatch[]
};

export type StatPatch = {
    season: number,
    key: string,
    value: number | null,
    percentile: number | null,
};
