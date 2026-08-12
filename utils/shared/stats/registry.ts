import {PercentileProperty} from "@/utils/main/modify-percentile-spec";
import {BASERUNNING_RUN_VALUE, BATTING_RUN_VALUE, FIELDING_RUN_VALUE} from "./batter_value";

const BATTER_VALUE_PROPERTIES: PercentileProperty[] = [
    BATTING_RUN_VALUE,
    FIELDING_RUN_VALUE,
    BASERUNNING_RUN_VALUE,
]

//region Batting & Pitching
const EXPECTED_WEIGHTED_ON_BASE_AVERAGE: PercentileProperty = {
    "label": "xwOBA",
    "value": "xwoba",
    "percent_value": "percent_rank_xwoba"
};

const EXPECTED_BATTING_AVERAGE: PercentileProperty = {
    "label": "xBA",
    "value": "xba",
    "percent_value": "percent_rank_xba"
};

const BARRELS: PercentileProperty = {
    "label": "Barrels",
    "value": "barrel",
    "percent_value": "percent_rank_barrel"
};

const BARREL_RATE: PercentileProperty = {
    "label": "Barrel %",
    "value": "barrel_batted_rate",
    "percent_value": "percent_rank_barrel_batted_rate"
};

const AVERAGE_EXIT_VELO: PercentileProperty = {
    "label": "Avg Exit Velo",
    "value": "exit_velocity_avg",
    "percent_value": "percent_rank_exit_velocity_avg"
};

const MAX_EXIT_VELO: PercentileProperty = {
    "label": "Max Exit Velo",
    "value": "exit_velocity_max",
    "percent_value": "percent_rank_exit_velocity_max"
};

const WHIFF_RATE: PercentileProperty = {
    "label": "Whiff %",
    "value": "whiff_percent",
    "percent_value": "percent_rank_whiff_percent"
};

const CHASE_RATE: PercentileProperty = {
    "label": "Chase %",
    "value": "chase_percent",
    "percent_value": "percent_rank_chase_percent"
};

const HARD_HIT_RATE: PercentileProperty = {
    "label": "Hard-Hit %",
    "value": "hard_hit_percent",
    "percent_value": "percent_rank_hard_hit_percent"
};

const GROUNDBALL_RATE: PercentileProperty = {
    "label": "GB %",
    "value": "groundballs_percent",
    "percent_value": "percent_rank_groundballs_percent"
};

const STRIKEOUT_RATE: PercentileProperty = {
    "label": "K %",
    "value": "k_percent",
    "percent_value": "percent_rank_k_percent"
};

const WALK_RATE: PercentileProperty = {
    "label": "BB %",
    "value": "bb_percent",
    "percent_value": "percent_rank_bb_percent"
};
//endregion Batting & Pitching

//region Batting
const AVERAGE_LAUNCH_ANGLE: PercentileProperty = {
    "label": "Avg Launch Angle",
    "value": "launch_angle_avg",
    "percent_value": "percent_rank_launch_angle_avg"
};

const EXPECTED_SLUGGING: PercentileProperty = {
    "label": "xSLG",
    "value": "xslg",
    "percent_value": "percent_rank_xslg"
};

const WEIGHTED_ON_BASE_AVERAGE: PercentileProperty = {
    "label": "wOBA",
    "value": "woba",
    "percent_value": "percent_rank_woba"
};

const EXPECTED_WEIGHTED_ON_BASE_AVERGAE_ON_CONTACT: PercentileProperty = {
    "label": "xwOBAcon",
    "value": "xwobacon",
    "percent_value": "percent_rank_xwobacon"
};

const WEIGHTED_ON_BASE_AVERAGE_ON_CONTACT: PercentileProperty = {
    "label": "wOBAcon",
    "value": "wobacon",
    "percent_value": "percent_rank_wobacon"
};

const STRIKE_ZONE_JUDGEMENT: PercentileProperty = {
    "label": "S.Z. Judge",
    "value": "sz_judge",
    "percent_value": "percent_rank_sz_judge"
};

const BATTING_AVERAGE: PercentileProperty = {
    "label": "BA",
    "value": "ba",
    "percent_value": "percent_rank_ba"
};

const BATTING_AVERAGE_ON_CONTACT: PercentileProperty = {
    "label": "BAcon",
    "value": "bacon",
    "percent_value": "percent_rank_bacon"
};

const EXPECTED_BATTING_AVERAGE_ON_CONTACT: PercentileProperty = {
    "label": "xBAcon",
    "value": "xbacon",
    "percent_value": "percent_rank_xbacon"
};

const BATTING_AVERAGE_ON_BALLS_IN_PLAY: PercentileProperty = {
    "label": "BABIP",
    "value": "babip",
    "percent_value": "percent_rank_babip"
};

const ON_BASE_PERCENTAGE: PercentileProperty = {
    "label": "OBP",
    "value": "obp",
    "percent_value": "percent_rank_obp"
};

const SLUGGING: PercentileProperty = {
    "label": "SLG",
    "value": "slg",
    "percent_value": "percent_rank_slg"
};

const EXPECTED_ON_BASE_PERCENTAGE: PercentileProperty = {
    "label": "xOBP",
    "value": "xobp",
    "percent_value": "percent_rank_xobp"
};

const ISOLATED_SLUGGING: PercentileProperty = {
    "label": "ISO",
    "value": "iso",
    "percent_value": "percent_rank_iso"
};

const EXPECTED_ISOLATED_SLUGGING: PercentileProperty = {
    "label": "xISO",
    "value": "xiso",
    "percent_value": "percent_rank_xiso"
};

const SWEET_SPOT_RATE: PercentileProperty = {
    "label": "Sweet-Spot %",
    "value": "sweet_spot_percent",
    "percent_value": "percent_rank_sweet_spot_percent"
};

const AVERAGE_HOME_RUN_DISTANCE: PercentileProperty = {
    "label": "Avg Home Run",
    "value": "distance_hr_avg",
    "percent_value": "percent_rank_distance_hr_avg"
};

const FLYBALL_RATE: PercentileProperty = {
    "label": "FB %",
    "value": "airballs_percent",
    "percent_value": "percent_rank_airballs_percent"
};

const PULLED_FLYBALL_RATE: PercentileProperty = {
    "label": "Pulled Flyball %",
    "value": "pull_percent_airballs",
    "percent_value": "percent_rank_pull_percent_airballs"
};

/** avg(max(88, EV)) */
const ADJUSTED_AVERAGE_EXIT_VELOCITY: PercentileProperty = {
    "label": "Adj. Avg EV",
    "value": "avg_hyper_speed",
    "percent_value": "percent_rank_avg_hyper_speed"
};

const EXIT_VELOCITY_50: PercentileProperty = {
    "label": "EV50",
    "value": "avg_best_speed",
    "percent_value": "percent_rank_avg_best_speed"
};

const EXPECTED_HOME_RUNS: PercentileProperty = {
    "label": "xHR",
    "value": "xhr",
    "percent_value": "percent_rank_xhr"
};

const BAT_SPEED: PercentileProperty = {
    "label": "Bat Speed",
    "value": "swing_speed",
    "percent_value": "percent_rank_swing_speed"
};

const SWING_LENGTH: PercentileProperty = {
    "label": "Swing Length",
    "value": "swing_length",
    "percent_value": "percent_rank_swing_length"
};

const SQUARED_UP_RATE: PercentileProperty = {
    "label": "Squared-Up %",
    "value": "squared_up_swing",
    "percent_value": "percent_rank_squared_up_swing"
};

const ATTACK_ANGLE: PercentileProperty = {
    "label": "Attack Angle",
    "value": "attack_angle",
    "percent_value": "percent_rank_attack_angle"
};

const BLAST_RATE: PercentileProperty = {
    "label": "Blast %",
    "value": "blasts_swing",
    "percent_value": "percent_rank_blasts_swing"
};

const SWING_PATH_TILT: PercentileProperty = {
    "label": "Swing Path Tilt",
    "value": "vertical_swing_path",
    "percent_value": "percent_rank_vertical_swing_path"
};

const BAT_SPEED_ACCELERATION: PercentileProperty = {
    "label": "Bat Speed Accel.",
    "value": "acceleration",
    "percent_value": "percent_rank_acceleration"
};

const IDEAL_ATTACK_ANGLE: PercentileProperty = {
    "label": "Ideal Attack-Angle %",
    "value": "ideal_angle_rate",
    "percent_value": "percent_rank_ideal_angle_rate"
};
//endregion Batting

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
