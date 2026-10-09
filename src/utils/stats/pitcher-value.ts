import type {PercentileProperty} from "@/utils/stats/module.ts";

/** same name as batting run value, same sample, although the values on the pitcher side are inverted */
export const PITCHING_RUN_VALUE: PercentileProperty = {
    label: "Pitching Run Value",
    value: "swing_take_run_value",
    percent_value: "percent_rank_swing_take_run_value",
    description: "Every pitch is assigned a run value based on its outcome (ball, strike, home run, etc.). The sum of all of a player's contributions across a season, or multiple seasons, measures his overall batting or pitching run value. A positive value represents runs created for hitters, and runs prevented for pitchers.",
};

export const FASTBALL_RUN_VALUE: PercentileProperty = {
    label: "Fastball Run Value",
    value: "pitch_run_value_fastball",
    percent_value: "percent_rank_pitch_run_value_fastball",
    description: "Pitching Run Value for fastballs only.",
};

export const BREAKING_RUN_VALUE: PercentileProperty = {
    label: "Breaking Run Value",
    value: "pitch_run_value_breaking",
    percent_value: "percent_rank_pitch_run_value_breaking",
    description: "Pitching Run Value for breaking balls only.",
};

export const OFFSPEED_RUN_VALUE: PercentileProperty = {
    label: "Offspeed Run Value",
    value: "pitch_run_value_offspeed",
    percent_value: "percent_rank_pitch_run_value_offspeed",
    description: "Pitching Run Value for offspeed pitches only.",
};
