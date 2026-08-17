import type {ExtendedPercentileProperty} from "@/utils/shared/stats/module.ts";

export const POP_TIME: ExtendedPercentileProperty = {
    label: "Pop Time",
    value: "pop_2b",
    percent_value: "percent_rank_pop_2b"
};

// /** percent_rank does not exist */
// export const CATCHER_ARM_STRENGTH: ExtendedPercentileProperty = {
//     label: "Arm Strength 2B",
//     value: "arm_cs_2b",
//     percent_value: "percent_rank_arm_cs_2b"
// };

export const BLOCKS_ABOVE_AVERAGE: ExtendedPercentileProperty = {
    label: "Blocks Above Avg",
    value: "blocks_above_average",
    percent_value: "percent_rank_blocks_above_average"
};

export const FRAMING: ExtendedPercentileProperty = {
    label: "Framing",
    value: "fielding_run_value_framing",
    percent_value: "percent_rank_fielding_run_value_framing"
};

/** does not take into account RE24 matrix */
export const FRAMING_UNWEIGHTED: ExtendedPercentileProperty = {
    label: "Framing (Unweighted)",
    value: "framing",
    percent_value: "percent_rank_framing"
};

export const CAUGHT_STEALING_ABOVE_AVERAGE: ExtendedPercentileProperty = {
    label: "CS Above Avg",
    value: "cs_above_average",
    percent_value: "percent_rank_cs_above_average"
};
