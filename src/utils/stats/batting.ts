import type {PercentileProperty} from "@/utils/stats/module.ts";

export const AVERAGE_LAUNCH_ANGLE: PercentileProperty = {
    label: "Avg Launch Angle",
    value: "launch_angle_avg",
    percent_value: "percent_rank_launch_angle_avg",
    description: "Average Launch Angle on BBEs",
};

export const EXPECTED_SLUGGING: PercentileProperty = {
    label: "xSLG",
    value: "xslg",
    percent_value: "percent_rank_xslg",
    description: "Expected SLG (like xwOBA)",
};

export const WEIGHTED_ON_BASE_AVERAGE: PercentileProperty = {
    label: "wOBA",
    value: "woba",
    percent_value: "percent_rank_woba",
    description: "Weighted On-Base Average (wOBA) is a rate statistic which attempts to credit a hitter for the value of each outcome (single, double, etc) rather than treating all hits or times on base equally. wOBA is on the same scale as On-Base Percentage (OBP) and is a better representation of offensive value than batting average, RBI, or OPS."
};

export const EXPECTED_WEIGHTED_ON_BASE_AVERGAE_ON_CONTACT: PercentileProperty = {
    label: "xwOBAcon",
    value: "xwobacon",
    percent_value: "percent_rank_xwobacon",
    description: "Expected wOBA on BBEs",
};

export const WEIGHTED_ON_BASE_AVERAGE_ON_CONTACT: PercentileProperty = {
    label: "wOBAcon",
    value: "wobacon",
    percent_value: "percent_rank_wobacon",
    description: "wOBA on BBEs",
};

export const STRIKE_ZONE_JUDGEMENT: PercentileProperty = {
    label: "S.Z. Judge",
    value: "sz_judge",
    percent_value: "percent_rank_sz_judge",
    description: "No clue."
};

export const BATTING_AVERAGE: PercentileProperty = {
    label: "BA",
    value: "ba",
    percent_value: "percent_rank_ba",
    description: "Batting. Average."
};

export const BATTING_AVERAGE_ON_CONTACT: PercentileProperty = {
    label: "BAcon",
    value: "bacon",
    percent_value: "percent_rank_bacon",
    description: "Batting Average on Contact",
};

export const EXPECTED_BATTING_AVERAGE_ON_CONTACT: PercentileProperty = {
    label: "xBAcon",
    value: "xbacon",
    percent_value: "percent_rank_xbacon",
    description: "Expected Batting Average on Contact",
};

export const BATTING_AVERAGE_ON_BALLS_IN_PLAY: PercentileProperty = {
    label: "BABIP",
    value: "babip",
    percent_value: "percent_rank_babip",
    description: "Batting Average on Balls in Play. Often used as a rudimentary \"luck\" stat.",
};

export const ON_BASE_PERCENTAGE: PercentileProperty = {
    label: "OBP",
    value: "obp",
    percent_value: "percent_rank_obp",
    description: "On-Base Percentage."
};

export const SLUGGING: PercentileProperty = {
    label: "SLG",
    value: "slg",
    percent_value: "percent_rank_slg",
    description: "Slugging."
};

export const EXPECTED_ON_BASE_PERCENTAGE: PercentileProperty = {
    label: "xOBP",
    value: "xobp",
    percent_value: "percent_rank_xobp",
    description: "Expected OBP (like xwOBA)",
};

export const ISOLATED_SLUGGING: PercentileProperty = {
    label: "ISO",
    value: "iso",
    percent_value: "percent_rank_iso",
    description: "Extra Bases per At Bat",
};

export const EXPECTED_ISOLATED_SLUGGING: PercentileProperty = {
    label: "xISO",
    value: "xiso",
    percent_value: "percent_rank_xiso",
    description: "Expected Extra Bases per At Bat (like xwOBA)"
};

export const LA_SWEET_SPOT_RATE: PercentileProperty = {
    label: "LA Sweet-Spot %",
    value: "sweet_spot_percent",
    percent_value: "percent_rank_sweet_spot_percent",
    description: "Percentage of BBEs with a launch angle between 8 and 32 degrees."
};

export const AVERAGE_HOME_RUN_DISTANCE: PercentileProperty = {
    label: "Avg. HR Distance",
    value: "distance_hr_avg",
    percent_value: "percent_rank_distance_hr_avg",
    description: "Average Home Run Distance",
};

export const FLYBALL_RATE: PercentileProperty = {
    label: "FB %",
    value: "airballs_percent",
    percent_value: "percent_rank_airballs_percent",
    description: "Percentage of BBEs that are air balls (non-groundballs)",
};

export const PULLED_FLYBALL_RATE: PercentileProperty = {
    label: "Pulled Flyball %",
    value: "pull_percent_airballs",
    percent_value: "percent_rank_pull_percent_airballs",
    description: "Percentage of BBEs that are pulled air balls (non-groundballs)"
};

/** avg(max(88, EV)) */
export const ADJUSTED_AVERAGE_EXIT_VELOCITY: PercentileProperty = {
    label: "Adj. Avg EV",
    value: "avg_hyper_speed",
    percent_value: "percent_rank_avg_hyper_speed",
    description: "Average Exit Velocity but each value is floored at 88mph to remove the tail.",
};

export const EXIT_VELOCITY_50: PercentileProperty = {
    label: "EV50",
    value: "avg_best_speed",
    percent_value: "percent_rank_avg_best_speed",
    description: "Average Exit Velocity on the top 50% of Exit Velocities",
};

export const EXPECTED_HOME_RUNS: PercentileProperty = {
    label: "xHR",
    value: "xhr",
    percent_value: "percent_rank_xhr",
    description: "Expected Home Runs",
};

export const BAT_SPEED: PercentileProperty = {
    label: "Bat Speed",
    value: "swing_speed",
    percent_value: "percent_rank_swing_speed",
    description: "Bat Speed.",
};

export const SWING_LENGTH: PercentileProperty = {
    label: "Swing Length",
    value: "swing_length",
    percent_value: "percent_rank_swing_length",
    description: "Swing Length",
};

export const SQUARED_UP_RATE: PercentileProperty = {
    label: "Squared-Up %",
    value: "squared_up_swing",
    percent_value: "percent_rank_squared_up_swing",
    description: "How much exit velocity was obtained compared to the maximum possible exit velocity available, given the speed of the swing and pitch."
};

export const ATTACK_ANGLE: PercentileProperty = {
    label: "Attack Angle",
    value: "attack_angle",
    percent_value: "percent_rank_attack_angle",
    description: "The vertical angle at which the sweet spot of the bat is traveling at the point of impact with the ball.",
};

export const BLAST_RATE: PercentileProperty = {
    label: "Blast %",
    value: "blasts_swing",
    percent_value: "percent_rank_blasts_swing",
    description: "A more valuable subset of squared-up balls, defining batted balls that were both squared-up and with a fast swing."
};

export const SWING_PATH_TILT: PercentileProperty = {
    label: "Swing Path Tilt",
    value: "vertical_swing_path",
    percent_value: "percent_rank_vertical_swing_path",
    description: "The vertical angle of the arc traced by the swing path over the 40 ms prior to contact. A higher tilt indicates a \"steeper\" swing, while a lower tilt indicates a \"flatter\" swing. "
};

export const BAT_SPEED_ACCELERATION: PercentileProperty = {
    label: "Bat Speed Accel.",
    value: "acceleration",
    percent_value: "percent_rank_acceleration",
    description: "Acceleration Speed of the Bat (no clue)",
};

export const IDEAL_ATTACK_ANGLE: PercentileProperty = {
    label: "Ideal Attack Angle %",
    value: "ideal_angle_rate",
    percent_value: "percent_rank_ideal_angle_rate",
    description: "A ball is hit at an \"Ideal Attack Angle,\" per Statcast, when it is hit with a 5-20° Attack Angle."
};
