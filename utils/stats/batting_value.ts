import type {PercentileProperty} from "@/utils/stats/module.ts";

/** same name as pitching run value, same sample */
export const BATTING_RUN_VALUE: PercentileProperty = {
    label: "Batting Run Value",
    value: "swing_take_run_value",
    percent_value: "percent_rank_swing_take_run_value"
};

export const FIELDING_RUN_VALUE: PercentileProperty = {
    label: "Fielding Run Value",
    value: "fielding_run_value",
    percent_value: "percent_rank_fielding_run_value"
};

export const BASERUNNING_RUN_VALUE: PercentileProperty = {
    label: "Baserunning Run Value",
    value: "runner_run_value",
    percent_value: "percent_rank_runner_run_value",
};
