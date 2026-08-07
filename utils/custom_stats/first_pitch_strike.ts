import type {CustomStat} from "@/utils/custom_stats/module.ts";

export const FirstPitchStrike = {
    from: function (rows: StatcastRow[]): { quantity: number; total: number; } {
        rows = rows.filter(row => row.strikes === 0 && row.balls === 0);
        return { quantity: rows.reduce((acc, row) => acc + (row.type === 'S' || row.type === 'X' ? 1 : 0), 0), total: rows.length };
    },
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    fold: function (lhs: { quantity: number; total: number; }, rhs: { quantity: number; total: number; }): { quantity: number; total: number; } {
        return { quantity: lhs.quantity + rhs.quantity, total: lhs.total + rhs.quantity };
    },
    value: function (self: { quantity: number; total: number; }): string {
        return (100.0 * self.quantity / self.total).toFixed(1);
    },
    name: "first_pitch_strike",
} satisfies CustomStat<{ quantity: number, total: number }>;
