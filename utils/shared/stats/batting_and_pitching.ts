import type {ExtendedPercentileProperty} from "@/utils/shared/stats/module.ts";

export const EXPECTED_WEIGHTED_ON_BASE_AVERAGE: ExtendedPercentileProperty = {
    label: "xwOBA",
    value: "xwoba",
    percent_value: "percent_rank_xwoba"
};

export const EXPECTED_BATTING_AVERAGE: ExtendedPercentileProperty = {
    label: "xBA",
    value: "xba",
    percent_value: "percent_rank_xba"
};

export const BARRELS: ExtendedPercentileProperty = {
    label: "Barrels",
    value: "barrel",
    percent_value: "percent_rank_barrel"
};

export const BARREL_RATE: ExtendedPercentileProperty = {
    label: "Barrel %",
    value: "barrel_batted_rate",
    percent_value: "percent_rank_barrel_batted_rate"
};

export const AVERAGE_EXIT_VELO: ExtendedPercentileProperty = {
    label: "Avg Exit Velo",
    value: "exit_velocity_avg",
    percent_value: "percent_rank_exit_velocity_avg"
};

export const MAX_EXIT_VELO: ExtendedPercentileProperty = {
    label: "Max Exit Velo",
    value: "exit_velocity_max",
    percent_value: "percent_rank_exit_velocity_max"
};

export const WHIFF_RATE: ExtendedPercentileProperty = {
    label: "Whiff %",
    value: "whiff_percent",
    percent_value: "percent_rank_whiff_percent"
};

export const CHASE_RATE: ExtendedPercentileProperty = {
    label: "Chase %",
    value: "chase_percent",
    percent_value: "percent_rank_chase_percent"
};

export const HARD_HIT_RATE: ExtendedPercentileProperty = {
    label: "Hard-Hit %",
    value: "hard_hit_percent",
    percent_value: "percent_rank_hard_hit_percent"
};

export const GROUNDBALL_RATE: ExtendedPercentileProperty = {
    label: "GB %",
    value: "groundballs_percent",
    percent_value: "percent_rank_groundballs_percent"
};

export const STRIKEOUT_RATE: ExtendedPercentileProperty = {
    label: "K %",
    value: "k_percent",
    percent_value: "percent_rank_k_percent"
};

export const WALK_RATE: ExtendedPercentileProperty = {
    label: "BB %",
    value: "bb_percent",
    percent_value: "percent_rank_bb_percent"
};
