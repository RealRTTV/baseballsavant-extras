import type {PercentileProperty} from "@/utils/stats/module.ts";

/** same name as batting run value, same sample, although the values on the pitcher side are inverted */
export const PITCHING_RUN_VALUE: PercentileProperty = {
    label: "Pitching Run Value",
    value: "swing_take_run_value",
    percent_value: "percent_rank_swing_take_run_value"
};

export const FASTBALL_RUN_VALUE: PercentileProperty = {
    label: "Fastball Run Value",
    value: "pitch_run_value_fastball",
    percent_value: "percent_rank_pitch_run_value_fastball"
};

export const BREAKING_RUN_VALUE: PercentileProperty = {
    label: "Breaking Run Value",
    value: "pitch_run_value_breaking",
    percent_value: "percent_rank_pitch_run_value_breaking"
};

export const OFFSPEED_RUN_VALUE: PercentileProperty = {
    label: "Offspeed Run Value",
    value: "pitch_run_value_offspeed",
    percent_value: "percent_rank_pitch_run_value_offspeed"
};
