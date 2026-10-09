import type {PercentileProperty} from "@/utils/stats/module.ts";

/** same name as pitching run value, same sample */
export const BATTING_RUN_VALUE: PercentileProperty = {
    label: "Batting Run Value",
    value: "swing_take_run_value",
    percent_value: "percent_rank_swing_take_run_value",
    description: "Every pitch is assigned a run value based on its outcome (ball, strike, home run, etc.). The sum of all of a player's contributions across a season, or multiple seasons, measures his overall batting or pitching run value. A positive value represents runs created for hitters, and runs prevented for pitchers.",
};

export const FIELDING_RUN_VALUE: PercentileProperty = {
    label: "Fielding Run Value",
    value: "fielding_run_value",
    percent_value: "percent_rank_fielding_run_value",
    description: "Statcast's overall metric for capturing a player’s measurable defensive performance onto a run-based scale, converting various metrics like OAA, blocking, framing, etc.",
};

export const BASERUNNING_RUN_VALUE: PercentileProperty = {
    label: "Baserunning Run Value",
    value: "runner_run_value",
    percent_value: "percent_rank_runner_run_value",
    description: "A Statcast metric designed to express the overall value of a baserunner, measured in runs created (or lost) via stealing bases and taking extra bases on the basepaths.",
};
