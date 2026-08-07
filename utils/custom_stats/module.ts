import type {StatcastRow} from "@/utils/statcast_row.ts";

export interface CustomStatDefinition {
    /** `snake_case` */
    name: string;
}

export interface CustomStat<Self> extends CustomStatDefinition {
    from(rows: StatcastRow[]): Self;

    serialize(self: Self): string;

    deserialize(s: string): Self;

    fold(lhs: Self, rhs: Self): Self;

    value(self: Self): string;
}
