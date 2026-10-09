import type {PercentileProperty} from "@/utils/stats/module.ts";

export const EXPECTED_WEIGHTED_ON_BASE_AVERAGE: PercentileProperty = {
    label: "xwOBA",
    value: "xwoba",
    percent_value: "percent_rank_xwoba",
    description: "xwOBA is formulated using exit velocity, launch angle and, on certain types of batted balls, Sprint Speed.",
};

export const EXPECTED_BATTING_AVERAGE: PercentileProperty = {
    label: "xBA",
    value: "xba",
    percent_value: "percent_rank_xba",
    description: "xBA measures the likelihood that a batted ball will become a hit.",
};

export const BARRELS: PercentileProperty = {
    label: "Barrels",
    value: "barrel",
    percent_value: "percent_rank_barrel",
    description: "A batted ball with the perfect combination of exit velocity and launch angle",
};

export const BARREL_RATE: PercentileProperty = {
    label: "Barrel %",
    value: "barrel_batted_rate",
    percent_value: "percent_rank_barrel_batted_rate",
    description: "A batted ball with the perfect combination of exit velocity and launch angle",
};

export const AVERAGE_EXIT_VELO: PercentileProperty = {
    label: "Avg Exit Velo",
    value: "exit_velocity_avg",
    percent_value: "percent_rank_exit_velocity_avg",
    description: "On average, how fast, in miles per hour, a ball was hit by a batter."
};

export const MAX_EXIT_VELO: PercentileProperty = {
    label: "Max Exit Velo",
    value: "exit_velocity_max",
    percent_value: "percent_rank_exit_velocity_max",
    description: "The fastest, in miles per hour, a ball was hit by a batter.",
};

export const WHIFF_RATE: PercentileProperty = {
    label: "Whiff %",
    value: "whiff_percent",
    percent_value: "percent_rank_whiff_percent",
    description: "The percent of swings that miss the ball.",
};

export const CHASE_RATE: PercentileProperty = {
    label: "Chase %",
    value: "chase_percent",
    percent_value: "percent_rank_chase_percent",
    description: "Chase rate is the percentage of out of zone pitches a batter swings at.",
};

export const HARD_HIT_RATE: PercentileProperty = {
    label: "Hard-Hit %",
    value: "hard_hit_percent",
    percent_value: "percent_rank_hard_hit_percent",
    description: "Statcast defines a 'hard-hit ball' as one hit with an exit velocity of 95 mph or higher."
};

export const GROUNDBALL_RATE: PercentileProperty = {
    label: "GB %",
    value: "groundballs_percent",
    percent_value: "percent_rank_groundballs_percent",
    description: "Percentage of BBEs that are a groundball",
};

export const STRIKEOUT_RATE: PercentileProperty = {
    label: "K %",
    value: "k_percent",
    percent_value: "percent_rank_k_percent",
    description: "Percentage of plate appearances that end in a strikeout.",
};

export const WALK_RATE: PercentileProperty = {
    label: "BB %",
    value: "bb_percent",
    percent_value: "percent_rank_bb_percent",
    description: "Percentage of plate appearances that end in a walk (unintentional).",
};
