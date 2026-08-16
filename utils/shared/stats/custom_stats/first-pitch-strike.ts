import type {CustomStat} from "@/utils/shared/stats/custom_stats/module";
import {DisplayType, type ExtendedPercentileProperty} from "@/utils/shared/stats";

export const FIRST_PITCH_STRIKE: ExtendedPercentileProperty = {
    label: "FPS %",
    value: "first_pitch_strike",
    percent_value: "percent_rank_first_pitch_strike",

    approx_mean: 61.5,
    approx_stdev: 3.5,
    display_type: DisplayType.OneDecimalPlace,
};

export const FIRST_PITCH_STRIKE_CODE = {
    apply: function (rows, map) {
        for (const row of rows) {
            if (row.strikes === 0 && row.balls === 0) {
                const id = String(row.pitcher);
                const entry = map[id] ??= {n: 0, t: 0};
                entry.t += 1;
                entry.n += (row.type === 'S' || row.type === 'X' ? 1 : 0);
            }
        }
    },
    value: (self): number => 100.0 * self.n / self.t,
    property: FIRST_PITCH_STRIKE,
} satisfies CustomStat<{ n: number, t: number }>;
