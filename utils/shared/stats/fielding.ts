import type {ExtendedPercentileProperty} from "@/utils/shared/stats/module.ts";

// /** commonly not filled out */
// export const OUTFIELDER_JUMP_DEPRECATED: ExtendedPercentileProperty = {
//     label: "Outfield Jump",
//     value: "jump_v_avg",
//     percent_value: "percent_rank_jump"
// };

export const OUTS_ABOVE_AVERAGE: ExtendedPercentileProperty = {
    label: "Range (OAA)",
    value: "oaa",
    percent_value: "percent_rank_oaa"
};

export const ARM_VALUE: ExtendedPercentileProperty = {
    label: "Arm Value",
    value: "fielding_run_value_arm",
    percent_value: "percent_rank_fielding_run_value_arm"
};

export const ARM_STRENGTH: ExtendedPercentileProperty = {
    label: "Arm Strength",
    value: "arm_overall",
    percent_value: "percent_rank_arm_overall"
};

// /** commonly not filled out */
// export const ARM_STRENGTH_DEPRECATED: ExtendedPercentileProperty = {
//     label: "Max. Arm Strength",
//     value: "arm_max",
//     percent_value: "percent_rank_arm_max"
// };
