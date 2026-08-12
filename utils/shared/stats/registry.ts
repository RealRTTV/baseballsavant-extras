import {PercentileProperty} from "@/utils/main/modify-percentile-spec";
import {BASERUNNING_RUN_VALUE, BATTING_RUN_VALUE, FIELDING_RUN_VALUE} from "./batter_value";
import {EXPECTED_WEIGHTED_ON_BASE_AVERAGE, EXPECTED_BATTING_AVERAGE, BARRELS, BARREL_RATE, AVERAGE_EXIT_VELO, MAX_EXIT_VELO, WHIFF_RATE, CHASE_RATE, HARD_HIT_RATE, GROUNDBALL_RATE, STRIKEOUT_RATE, WALK_RATE} from "./batting_and_pitching";

export const BATTER_VALUE_PROPERTIES: PercentileProperty[] = [
    BATTING_RUN_VALUE,
    FIELDING_RUN_VALUE,
    BASERUNNING_RUN_VALUE,
]

export const BATTING_AND_PITCHING_PROPERTIES: PercentileProperty[] = [
    EXPECTED_WEIGHTED_ON_BASE_AVERAGE,
    EXPECTED_BATTING_AVERAGE,
    BARRELS,
    BARREL_RATE,
    AVERAGE_EXIT_VELO,
    MAX_EXIT_VELO,
    WHIFF_RATE,
    CHASE_RATE,
    HARD_HIT_RATE,
    GROUNDBALL_RATE,
    STRIKEOUT_RATE,
    WALK_RATE,
]



//region Pitcher Value
/** same name as batting run value, same sample, although the values on the pitcher side are inverted */
const PITCHING_RUN_VALUE: PercentileProperty = {
    "label": "Pitching Run Value",
    "value": "swing_take_run_value",
    "percent_value": "percent_rank_swing_take_run_value"
};

const FASTBALL_RUN_VALUE: PercentileProperty = {
    "label": "Fastball Run Value",
    "value": "pitch_run_value_fastball",
    "percent_value": "percent_rank_pitch_run_value_fastball"
};

const BREAKING_RUN_VALUE: PercentileProperty = {
    "label": "Breaking Run Value",
    "value": "pitch_run_value_breaking",
    "percent_value": "percent_rank_pitch_run_value_breaking"
};

const OFFSPEED_RUN_VALUE: PercentileProperty = {
    "label": "Offspeed Run Value",
    "value": "pitch_run_value_offspeed",
    "percent_value": "percent_rank_pitch_run_value_offspeed"
};
//endregion Pitcher Value

//region Pitching
const FASTBALL_VELO: PercentileProperty = {
    "label": "Fastball Velo",
    "value": "fastball_velo",
    "percent_value": "percent_rank_fastball_velo"
};

const FASTBALL_SPIN: PercentileProperty = {
    "label": "Fastball Spin",
    "value": "fastball_spin",
    "percent_value": "percent_rank_fastball_spin"
};

const EXTENSION: PercentileProperty = {
    "label": "Extension",
    "value": "fastball_extension",
    "percent_value": "percent_rank_fastball_extension"
};

const CURVEBALL_SPIN: PercentileProperty = {
    "label": "Curveball Spin",
    "value": "cu_spin",
    "percent_value": "percent_rank_cu_spin"
};

const EXPECTED_ERA: PercentileProperty = {
    "label": "xERA",
    "value": "xera",
    "percent_value": "percent_rank_xera"
};
//endregion

//region Catching
const POP_TIME: PercentileProperty = {
    "label": "Pop Time",
    "value": "pop_2b",
    "percent_value": "percent_rank_pop_2b"
};

// /** @todo percent_rank does not exist */
// const CAUGHT_STEALING_ABOVE_AVERAGE_DEPRECATED: PercentileProperty = {
//     "label": "CS Above Avg",
//     "value": "arm_cs_2b",
//     "percent_value": "percent_rank_arm_cs_2b"
// };

const BLOCKS_ABOVE_AVERAGE: PercentileProperty = {
    "label": "Blocks Above Avg",
    "value": "blocks_above_average",
    "percent_value": "percent_rank_blocks_above_average"
};

const FRAMING: PercentileProperty = {
    "label": "Framing",
    "value": "fielding_run_value_framing",
    "percent_value": "percent_rank_fielding_run_value_framing"
};

/** does not take into account RE24 matrix */
const FRAMING_UNWEIGHTED: PercentileProperty = {
    "label": "Framing (Old)",
    "value": "framing",
    "percent_value": "percent_rank_framing"
};

const CAUGHT_STEALING_ABOVE_AVERAGE: PercentileProperty = {
    "label": "CS Above Avg",
    "value": "cs_above_average",
    "percent_value": "percent_rank_cs_above_average"
};

//endregion Catching

//region Fielding
// /** @todo commonly not filled out */
// const OUTFIELDER_JUMP_DEPRECATED: PercentileProperty = {
//     "label": "Outfielder Jump",
//     "value": "jump_v_avg",
//     "percent_value": "percent_rank_jump"
// };

const OUTS_ABOVE_AVERAGE: PercentileProperty = {
    "label": "Range (OAA)",
    "value": "oaa",
    "percent_value": "percent_rank_oaa"
};

const ARM_VALUE: PercentileProperty = {
    "label": "Arm Value",
    "value": "fielding_run_value_arm",
    "percent_value": "percent_rank_fielding_run_value_arm"
};

const ARM_STRENGTH: PercentileProperty = {
    "label": "Arm Strength",
    "value": "arm_overall",
    "percent_value": "percent_rank_arm_overall"
};

// /** @todo commonly not filled out */
// const ARM_STRENGTH_DEPRECATED: PercentileProperty = {
//     "label": "Arm Strength (Max)",
//     "value": "arm_max",
//     "percent_value": "percent_rank_arm_max"
// };
//endregion Fielding

//region Baserunning
const SPRINT_SPEED: PercentileProperty = {
    "label": "Sprint Speed",
    "value": "sprint_speed",
    "percent_value": "percent_rank_speed_order"
};

const EXTRA_BASE_RUN_VALUE: PercentileProperty = {
    "label": "Extra Base Run Value",
    "value": "runner_runs_xb",
    "percent_value": "percent_rank_runner_runs_xb"
};

const STOLEN_BASE_RUN_VALUE: PercentileProperty = {
    "label": "Stolen Base Run Value",
    "value": "runner_runs_sb",
    "percent_value": "percent_rank_runner_runs_sb"
};
//endregion Baserunning
