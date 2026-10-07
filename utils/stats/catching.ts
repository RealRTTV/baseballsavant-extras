import type {PercentileProperty} from "@/utils/stats/module.ts";

export const POP_TIME: PercentileProperty = {
    label: "Pop Time",
    value: "pop_2b",
    percent_value: "percent_rank_pop_2b",
    description: "How quickly, in seconds, a catcher can get the ball out of his glove and to the base on a stolen base or pickoff attempt.",
};

// /** percent_rank does not exist */
// export const CATCHER_ARM_STRENGTH: PercentileProperty = {
//     label: "Arm Strength 2B",
//     value: "arm_cs_2b",
//     percent_value: "percent_rank_arm_cs_2b"
// };

export const BLOCKS_ABOVE_AVERAGE: PercentileProperty = {
    label: "Blocks Above Avg",
    value: "blocks_above_average",
    percent_value: "percent_rank_blocks_above_average",
    description: "A Statcast metric designed to express the demonstrated skill of catchers at preventing wild pitches or passed balls compared to their peers.",
};

export const FRAMING: PercentileProperty = {
    label: "Framing",
    value: "fielding_run_value_framing",
    percent_value: "percent_rank_fielding_run_value_framing",
    description: "Catcher framing is the art of a catcher receiving a pitch in a way that makes it more likely for an umpire to call it a strike -- whether that's turning a borderline ball into a strike, or not losing a strike to a \"ball\" call due to poor framing.",
};

/** does not take into account RE24 matrix */
export const FRAMING_UNWEIGHTED: PercentileProperty = {
    label: "Framing (Unweighted)",
    value: "framing",
    percent_value: "percent_rank_framing",
    description: "Does not take into account RE24 matrix",
};

export const CAUGHT_STEALING_ABOVE_AVERAGE: PercentileProperty = {
    label: "CS Above Avg",
    value: "cs_above_average",
    percent_value: "percent_rank_cs_above_average",
    description: "Number of Caught Stealings above average",
};
