import type {CustomStat} from "@/utils/shared/stats/custom_stats/module";
import {DisplayType, type ExtendedPercentileProperty} from "@/utils/shared/stats";

export const FIRST_PITCH_STRIKE: ExtendedPercentileProperty = {
    label: "FPS %",
    value: "first_pitch_strike",
    percent_value: "percent_rank_first_pitch_strike",

    display_type: DisplayType.OneDecimalPlace,
    qualification_threshold: 100,
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
    is_qualified: (self, threshold): boolean => self.t >= threshold,
    property: FIRST_PITCH_STRIKE,
} satisfies CustomStat<{ n: number, t: number }>;
