import type {JSCustomStatInternal} from "@/utils/stats/custom_stats/module";
import {DisplayType} from "@/utils/stats";

export const FIRST_PITCH_STRIKE = {
    create_cache: () => ({ by_player: {}, cached_dates: [] }),
    on_incremental: function () {},
    apply: function (cache, rows, _) {
        console.log(`# rows: ${rows.length}; # matching: ${rows.filter(r => r.strikes + r.balls === 0).length}; first row: ${JSON.stringify(rows[0])}`);
        cache.by_player['0'] = {n: 0, t: 0};
        for (const row of rows) {
            if (row.strikes === 0 && row.balls === 0) {
                const id = String(row.pitcher);
                const entry = (cache.by_player[id] ??= {n: 0, t: 0});
                entry.t += 1;
                entry.n += (row.type === 'S' || row.type === 'X' ? 1 : 0);
                console.log(cache.by_player[id]);
            }
        }
        return cache;
    },
    on_finish_apply: () => false,
    value: ({ n, t }): number => 100.0 * n / t,
    samples: ({ t }) => t,
    property: {
        label: "FPS %",
        value: "first_pitch_strike",
        percent_value: "percent_rank_first_pitch_strike",

        display_type: DisplayType.OneDecimalPlace,
        wants_subsidiary_csv: false,
    },
} satisfies JSCustomStatInternal<{ n: number, t: number }>;
