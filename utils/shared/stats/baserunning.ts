import type {ExtendedPercentileProperty} from "@/utils/shared/stats/module.ts";

export const SPRINT_SPEED: ExtendedPercentileProperty = {
    label: "Sprint Speed",
    value: "sprint_speed",
    percent_value: "percent_rank_speed_order"
};

export const EXTRA_BASE_RUN_VALUE: ExtendedPercentileProperty = {
    label: "Extra Base Run Value",
    value: "runner_runs_xb",
    percent_value: "percent_rank_runner_runs_xb"
};

export const STOLEN_BASE_RUN_VALUE: ExtendedPercentileProperty = {
    label: "Stolen Base Run Value",
    value: "runner_runs_sb",
    percent_value: "percent_rank_runner_runs_sb"
};
