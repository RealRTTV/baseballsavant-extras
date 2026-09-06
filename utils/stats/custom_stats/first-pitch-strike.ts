import type {CustomStat} from "@/utils/stats/custom_stats/module";
import {DisplayType} from "@/utils/stats";

export const FIRST_PITCH_STRIKE = {
    create_cache: () => ({ by_player: {}, cached_dates: [] }),
    on_incremental: function () {},
    apply: function (rows, { by_player: map }) {
        for (const row of rows) {
            if (row.strikes === 0 && row.balls === 0) {
                const id = String(row.pitcher);
                const entry = map[id] ??= {n: 0, t: 0};
                entry.t += 1;
                entry.n += (row.type === 'S' || row.type === 'X' ? 1 : 0);
            }
        }
    },
    on_finish_apply: () => false,
    value: ({ n, t }): number => 100.0 * n / t,
    samples: ({ t }) => t,
    property: {
        label: "FPS %",
        value: "first_pitch_strike",
        percent_value: "percent_rank_first_pitch_strike",

        display_type: DisplayType.OneDecimalPlace,
    },
} satisfies CustomStat<{ n: number, t: number }>;
