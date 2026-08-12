import {PercentileProperty} from "@/utils/main/modify-percentile-spec";

export const POP_TIME: PercentileProperty = {
    "label": "Pop Time",
    "value": "pop_2b",
    "percent_value": "percent_rank_pop_2b"
};

// /** @todo percent_rank does not exist */
// export const CAUGHT_STEALING_ABOVE_AVERAGE_DEPRECATED: PercentileProperty = {
//     "label": "CS Above Avg",
//     "value": "arm_cs_2b",
//     "percent_value": "percent_rank_arm_cs_2b"
// };

export const BLOCKS_ABOVE_AVERAGE: PercentileProperty = {
    "label": "Blocks Above Avg",
    "value": "blocks_above_average",
    "percent_value": "percent_rank_blocks_above_average"
};

export const FRAMING: PercentileProperty = {
    "label": "Framing",
    "value": "fielding_run_value_framing",
    "percent_value": "percent_rank_fielding_run_value_framing"
};

/** does not take into account RE24 matrix */
export const FRAMING_OLD: PercentileProperty = {
    "label": "Framing (Old)",
    "value": "framing",
    "percent_value": "percent_rank_framing"
};

export const CAUGHT_STEALING_ABOVE_AVERAGE: PercentileProperty = {
    "label": "CS Above Avg",
    "value": "cs_above_average",
    "percent_value": "percent_rank_cs_above_average"
};
