import type {PercentileProperty} from "@/utils/shared/stats/module.ts";

export const AVERAGE_LAUNCH_ANGLE: PercentileProperty = {
    label: "Avg Launch Angle",
    value: "launch_angle_avg",
    percent_value: "percent_rank_launch_angle_avg"
};

export const EXPECTED_SLUGGING: PercentileProperty = {
    label: "xSLG",
    value: "xslg",
    percent_value: "percent_rank_xslg"
};

export const WEIGHTED_ON_BASE_AVERAGE: PercentileProperty = {
    label: "wOBA",
    value: "woba",
    percent_value: "percent_rank_woba"
};

export const EXPECTED_WEIGHTED_ON_BASE_AVERGAE_ON_CONTACT: PercentileProperty = {
    label: "xwOBAcon",
    value: "xwobacon",
    percent_value: "percent_rank_xwobacon"
};

export const WEIGHTED_ON_BASE_AVERAGE_ON_CONTACT: PercentileProperty = {
    label: "wOBAcon",
    value: "wobacon",
    percent_value: "percent_rank_wobacon"
};

export const STRIKE_ZONE_JUDGEMENT: PercentileProperty = {
    label: "S.Z. Judge",
    value: "sz_judge",
    percent_value: "percent_rank_sz_judge"
};

export const BATTING_AVERAGE: PercentileProperty = {
    label: "BA",
    value: "ba",
    percent_value: "percent_rank_ba"
};

export const BATTING_AVERAGE_ON_CONTACT: PercentileProperty = {
    label: "BAcon",
    value: "bacon",
    percent_value: "percent_rank_bacon"
};

export const EXPECTED_BATTING_AVERAGE_ON_CONTACT: PercentileProperty = {
    label: "xBAcon",
    value: "xbacon",
    percent_value: "percent_rank_xbacon"
};

export const BATTING_AVERAGE_ON_BALLS_IN_PLAY: PercentileProperty = {
    label: "BABIP",
    value: "babip",
    percent_value: "percent_rank_babip"
};

export const ON_BASE_PERCENTAGE: PercentileProperty = {
    label: "OBP",
    value: "obp",
    percent_value: "percent_rank_obp"
};

export const SLUGGING: PercentileProperty = {
    label: "SLG",
    value: "slg",
    percent_value: "percent_rank_slg"
};

export const EXPECTED_ON_BASE_PERCENTAGE: PercentileProperty = {
    label: "xOBP",
    value: "xobp",
    percent_value: "percent_rank_xobp"
};

export const ISOLATED_SLUGGING: PercentileProperty = {
    label: "ISO",
    value: "iso",
    percent_value: "percent_rank_iso"
};

export const EXPECTED_ISOLATED_SLUGGING: PercentileProperty = {
    label: "xISO",
    value: "xiso",
    percent_value: "percent_rank_xiso"
};

export const SWEET_SPOT_RATE: PercentileProperty = {
    label: "Sweet-Spot %",
    value: "sweet_spot_percent",
    percent_value: "percent_rank_sweet_spot_percent"
};

export const AVERAGE_HOME_RUN_DISTANCE: PercentileProperty = {
    label: "Avg. HR Distance",
    value: "distance_hr_avg",
    percent_value: "percent_rank_distance_hr_avg"
};

export const FLYBALL_RATE: PercentileProperty = {
    label: "FB %",
    value: "airballs_percent",
    percent_value: "percent_rank_airballs_percent"
};

export const PULLED_FLYBALL_RATE: PercentileProperty = {
    label: "Pulled Flyball %",
    value: "pull_percent_airballs",
    percent_value: "percent_rank_pull_percent_airballs"
};

/** avg(max(88, EV)) */
export const ADJUSTED_AVERAGE_EXIT_VELOCITY: PercentileProperty = {
    label: "Adj. Avg EV",
    value: "avg_hyper_speed",
    percent_value: "percent_rank_avg_hyper_speed"
};

export const EXIT_VELOCITY_50: PercentileProperty = {
    label: "EV50",
    value: "avg_best_speed",
    percent_value: "percent_rank_avg_best_speed"
};

export const EXPECTED_HOME_RUNS: PercentileProperty = {
    label: "xHR",
    value: "xhr",
    percent_value: "percent_rank_xhr"
};

export const BAT_SPEED: PercentileProperty = {
    label: "Bat Speed",
    value: "swing_speed",
    percent_value: "percent_rank_swing_speed"
};

export const SWING_LENGTH: PercentileProperty = {
    label: "Swing Length",
    value: "swing_length",
    percent_value: "percent_rank_swing_length"
};

export const SQUARED_UP_RATE: PercentileProperty = {
    label: "Squared-Up %",
    value: "squared_up_swing",
    percent_value: "percent_rank_squared_up_swing"
};

export const ATTACK_ANGLE: PercentileProperty = {
    label: "Attack Angle",
    value: "attack_angle",
    percent_value: "percent_rank_attack_angle"
};

export const BLAST_RATE: PercentileProperty = {
    label: "Blast %",
    value: "blasts_swing",
    percent_value: "percent_rank_blasts_swing"
};

export const SWING_PATH_TILT: PercentileProperty = {
    label: "Swing Path Tilt",
    value: "vertical_swing_path",
    percent_value: "percent_rank_vertical_swing_path"
};

export const BAT_SPEED_ACCELERATION: PercentileProperty = {
    label: "Bat Speed Accel.",
    value: "acceleration",
    percent_value: "percent_rank_acceleration"
};

export const IDEAL_ATTACK_ANGLE: PercentileProperty = {
    label: "Ideal Attack Angle %",
    value: "ideal_angle_rate",
    percent_value: "percent_rank_ideal_angle_rate"
};
