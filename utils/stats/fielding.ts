import type {PercentileProperty} from "@/utils/stats/module.ts";

// /** commonly not filled out */
// export const OUTFIELDER_JUMP_DEPRECATED: PercentileProperty = {
//     label: "Outfield Jump",
//     value: "jump_v_avg",
//     percent_value: "percent_rank_jump"
// };

export const OUTS_ABOVE_AVERAGE: PercentileProperty = {
    label: "Range (OAA)",
    value: "oaa",
    percent_value: "percent_rank_oaa",
    description: "A range-based metric of skill that shows how many outs a player has saved over his peers.",
};

export const ARM_VALUE: PercentileProperty = {
    label: "Arm Value",
    value: "fielding_run_value_arm",
    percent_value: "percent_rank_fielding_run_value_arm",
    description: "Run Value from the outfielder's arm (such as Outfield Assists)",
};

export const ARM_STRENGTH: PercentileProperty = {
    label: "Arm Strength",
    value: "arm_overall",
    percent_value: "percent_rank_arm_overall",
    description: "How hard, in miles per hour, a fielder throws the ball.",
};

// /** commonly not filled out */
// export const ARM_STRENGTH_DEPRECATED: PercentileProperty = {
//     label: "Max. Arm Strength",
//     value: "arm_max",
//     percent_value: "percent_rank_arm_max"
// };
