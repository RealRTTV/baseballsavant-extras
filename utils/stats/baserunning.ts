import type {PercentileProperty} from "@/utils/stats/module.ts";

export const SPRINT_SPEED: PercentileProperty = {
    label: "Sprint Speed",
    value: "sprint_speed",
    percent_value: "percent_rank_speed_order",
    description: "A measurement of a player's top running speed, expressed in \"feet per second in a player's fastest one-second window.\""
};

export const EXTRA_BASE_RUN_VALUE: PercentileProperty = {
    label: "Extra Base Run Value",
    value: "runner_runs_xb",
    percent_value: "percent_rank_runner_runs_xb",
    description: "Run Value provided from taking extra bases on hits.",
};

export const STOLEN_BASE_RUN_VALUE: PercentileProperty = {
    label: "Stolen Base Run Value",
    value: "runner_runs_sb",
    percent_value: "percent_rank_runner_runs_sb",
    description: "Run Value provided from Stolen Bases",
};
