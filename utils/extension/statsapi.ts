type StatsResponse = {
    stats: Stat[],
};

type Stat = {
    splits: Split[],
}

type Split = {
    player: Player,
}

type Player = {
    id: number;
}

export async function qualifiedPitchers(season: number): Promise<number[]> {
    const URL: string = `https://statsapi.mlb.com/api/v1/stats?stats=season&group=pitching&season=${season}&sportId=1&playerPool=QUALIFIED&limit=1000&fields=stats,splits,player,id`;
    const response = await fetch(URL);
    if (!response.ok) {
        return [];
    }

    const statsResponse: StatsResponse = JSON.parse(await response.text());

    return statsResponse.stats[0]!.splits.map((person: Split) => person.player.id);
}