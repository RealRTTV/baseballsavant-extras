import type {CustomStat} from "@/utils/shared/custom_stats/module.ts";

export const FIRST_PITCH_STRIKE = {
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
    value: (self): number => self.n / self.t,
    value_pretty: (self): number => Number((100.0 * self.n / self.t).toFixed(1)),
    name: "first_pitch_strike",
} satisfies CustomStat<{ n: number, t: number }>;
