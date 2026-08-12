type RegisteredStat = {
    label: string,
    value: string,
    percent_value: string,
};

const BARRELS: RegisteredStat = {
    "label": "Barrels",
    "value": "barrel",
    "percent_value": "percent_rank_barrel"
};

const BARREL_RATE: RegisteredStat = {
    "label": "Barrel %",
    "value": "barrel_batted_rate",
    "percent_value": "percent_rank_barrel_batted_rate"
};

const AVG_EXIT_VELO: RegisteredStat = {
    "label": "Avg Exit Velo",
    "value": "exit_velocity_avg",
    "percent_value": "percent_rank_exit_velocity_avg"
};

const MAX_EXIT_VELO: RegisteredStat = {
    "label": "Max Exit Velo",
    "value": "exit_velocity_max",
    "percent_value": "percent_rank_exit_velocity_max"
};

const AVG_LAUNCH_ANGLE: RegisteredStat = {
    "label": "Avg Launch Angle",
    "value": "launch_angle_avg",
    "percent_value": "percent_rank_launch_angle_avg"
};

const EXPECTED_BATTING_AVERAGE: RegisteredStat = {
    "label": "xBA",
    "value": "xba",
    "percent_value": "percent_rank_xba"
};

const EXPECTED_SLUGGING: RegisteredStat = {
    "label": "xSLG",
    "value": "xslg",
    "percent_value": "percent_rank_xslg"
};

const EXPECTED_WEIGHTED_ON_BASE_AVERAGE: RegisteredStat = {
    "label": "xwOBA",
    "value": "xwoba",
    "percent_value": "percent_rank_xwoba"
};

const WEIGHTED_ON_BASE_AVERAGE: RegisteredStat = {
    "label": "wOBA",
    "value": "woba",
    "percent_value": "percent_rank_woba"
};

const HARD_HIT_RATE: RegisteredStat = {
    "label": "Hard-Hit %",
    "value": "hard_hit_percent",
    "percent_value": "percent_rank_hard_hit_percent"
};

const EXPECTED_WEIGHTED_ON_BASE_AVERGAE_ON_CONTACT: RegisteredStat = {
    "label": "xwOBAcon",
    "value": "xwobacon",
    "percent_value": "percent_rank_xwobacon"
};

const WEIGHTED_ON_BASE_AVERAGE_ON_CONTACT: RegisteredStat = {
    "label": "wOBAcon",
    "value": "wobacon",
    "percent_value": "percent_rank_wobacon"
};

const STRIKEOUT_RATE: RegisteredStat = {
    "label": "K %",
    "value": "k_percent",
    "percent_value": "percent_rank_k_percent"
};

const WALK_RATE: RegisteredStat = {
    "label": "BB %",
    "value": "bb_percent",
    "percent_value": "percent_rank_bb_percent"
};

const STRIKE_ZONE_JUDGEMENT: RegisteredStat = {
    "label": "S.Z. Judge",
    "value": "sz_judge",
    "percent_value": "percent_rank_sz_judge"
};

const WHIFF_RATE: RegisteredStat = {
    "label": "Whiff %",
    "value": "whiff_percent",
    "percent_value": "percent_rank_whiff_percent"
};

const CHASE_RATE: RegisteredStat = {
    "label": "Chase %",
    "value": "chase_percent",
    "percent_value": "percent_rank_chase_percent"
};

const BATTING_AVERAGE: RegisteredStat = {
    "label": "BA",
    "value": "ba",
    "percent_value": "percent_rank_ba"
};

const BATTING_AVERAGE_ON_CONTACT: RegisteredStat = {
    "label": "BAcon",
    "value": "bacon",
    "percent_value": "percent_rank_bacon"
};

const EXPECTED_BATTING_AVERAGE_ON_CONTACT: RegisteredStat = {
    "label": "xBAcon",
    "value": "xbacon",
    "percent_value": "percent_rank_xbacon"
};

const BATTING_AVERAGE_ON_BALLS_IN_PLAY: RegisteredStat = {
    "label": "BABIP",
    "value": "babip",
    "percent_value": "percent_rank_babip"
};

const ON_BASE_PERCENTAGE: RegisteredStat = {
    "label": "OBP",
    "value": "obp",
    "percent_value": "percent_rank_obp"
};

const SLUGGING: RegisteredStat = {
    "label": "SLG",
    "value": "slg",
    "percent_value": "percent_rank_slg"
};

const EXPECTED_ON_BASE_PERCENTAGE: RegisteredStat = {
    "label": "xOBP",
    "value": "xobp",
    "percent_value": "percent_rank_xobp"
};

const ISOLATED_SLUGGING: RegisteredStat = {
    "label": "ISO",
    "value": "iso",
    "percent_value": "percent_rank_iso"
};

const EXPECTED_ISOLATED_SLUGGING: RegisteredStat = {
    "label": "xISO",
    "value": "xiso",
    "percent_value": "percent_rank_xiso"
};

const SWEET_SPOT_RATE: RegisteredStat = {
    "label": "Sweet-Spot %",
    "value": "sweet_spot_percent",
    "percent_value": "percent_rank_sweet_spot_percent"
};

const AVERAGE_HOME_RUN_DISTANCE: RegisteredStat = {
    "label": "Avg Home Run",
    "value": "distance_hr_avg",
    "percent_value": "percent_rank_distance_hr_avg"
};

const GROUNDBALL_RATE: RegisteredStat = {
    "label": "GB %",
    "value": "groundballs_percent",
    "percent_value": "percent_rank_groundballs_percent"
};

const FLYBALL_RATE: RegisteredStat = {
    "label": "FB %",
    "value": "airballs_percent",
    "percent_value": "percent_rank_airballs_percent"
};

const PULLED_FLYBALL_RATE: RegisteredStat = {
    "label": "Pulled Flyball %",
    "value": "pull_percent_airballs",
    "percent_value": "percent_rank_pull_percent_airballs"
};

const ADJUSTED_AVERAGE_EXIT_VELOCITY: RegisteredStat = {
    "label": "Adj. Avg EV",
    "value": "avg_hyper_speed",
    "percent_value": "percent_rank_avg_hyper_speed"
};

const EXIT_VELOCITY_50: RegisteredStat = {
    "label": "EV50",
    "value": "avg_best_speed",
    "percent_value": "percent_rank_avg_best_speed"
};

const FASTBALL_RUN_VALUE: RegisteredStat = {
    "label": "Fastball Run Value",
    "value": "pitch_run_value_fastball",
    "percent_value": "percent_rank_pitch_run_value_fastball"
};

const BREAKING_RUN_VALUE: RegisteredStat = {
    "label": "Breaking Run Value",
    "value": "pitch_run_value_breaking",
    "percent_value": "percent_rank_pitch_run_value_breaking"
};

const OFFSPEED_RUN_VALUE: RegisteredStat = {
    "label": "Offspeed Run Value",
    "value": "pitch_run_value_offspeed",
    "percent_value": "percent_rank_pitch_run_value_offspeed"
};

const REGISTERED_STATS: RegisteredStat[] = [
    {
        "label": "",
        "value": "speed_order",
        "percent_value": "percent_rank_speed_order"
    },
    {
        "label": "Pop Time",
        "value": "pop_2b",
        "percent_value": "percent_rank_pop_2b"
    },
    {
        "label": "CS Above Avg",
        "value": "arm_cs_2b",
        "percent_value": "percent_rank_arm_cs_2b"
    },
    {
        "label": "Range (OAA)",
        "value": "oaa",
        "percent_value": "percent_rank_oaa"
    },
    {
        "label": "Framing",
        "value": "framing",
        "percent_value": "percent_rank_framing"
    },
    {
        "label": "",
        "value": "jump",
        "percent_value": "percent_rank_jump"
    },
    {
        "label": "",
        "value": "fastball_velo",
        "percent_value": "percent_rank_fastball_velo"
    },
    {
        "label": "",
        "value": "fastball_spin",
        "percent_value": "percent_rank_fastball_spin"
    },
    {
        "label": "",
        "value": "fastball_extension",
        "percent_value": "percent_rank_fastball_extension"
    },
    {
        "label": "",
        "value": "cu_spin",
        "percent_value": "percent_rank_cu_spin"
    },
    {
        "label": "",
        "value": "xera",
        "percent_value": "percent_rank_xera"
    },
    {
        "label": "",
        "value": "arm_max",
        "percent_value": "percent_rank_arm_max"
    },
    {
        "label": "",
        "value": "arm_overall",
        "percent_value": "percent_rank_arm_overall"
    },
    {
        "label": "",
        "value": "xhr",
        "percent_value": "percent_rank_xhr"
    },
    {
        "label": "",
        "value": "swing_take_run_value",
        "percent_value": "percent_rank_swing_take_run_value"
    },
    {
        "label": "",
        "value": "blocks_above_average",
        "percent_value": "percent_rank_blocks_above_average"
    },
    {
        "label": "",
        "value": "cs_above_average",
        "percent_value": "percent_rank_cs_above_average"
    },
    {
        "label": "",
        "value": "fielding_run_value",
        "percent_value": "percent_rank_fielding_run_value"
    },
    {
        "label": "",
        "value": "runner_run_value",
        "percent_value": "percent_rank_runner_run_value"
    },
    {
        "label": "",
        "value": "runner_runs_sb",
        "percent_value": "percent_rank_runner_runs_sb"
    },
    {
        "label": "",
        "value": "runner_runs_xb",
        "percent_value": "percent_rank_runner_runs_xb"
    },
    {
        "label": "",
        "value": "fielding_run_value_arm",
        "percent_value": "percent_rank_fielding_run_value_arm"
    },
    {
        "label": "",
        "value": "fielding_run_value_framing",
        "percent_value": "percent_rank_fielding_run_value_framing"
    },
    {
        "label": "",
        "value": "blasts_swing",
        "percent_value": "percent_rank_blasts_swing"
    },
    {
        "label": "",
        "value": "swing_speed",
        "percent_value": "percent_rank_swing_speed"
    },
    {
        "label": "",
        "value": "swing_length",
        "percent_value": "percent_rank_swing_length"
    },
    {
        "label": "",
        "value": "squared_up_swing",
        "percent_value": "percent_rank_squared_up_swing"
    },
    {
        "label": "",
        "value": "attack_angle",
        "percent_value": "percent_rank_attack_angle"
    },
    {
        "label": "",
        "value": "vertical_swing_path",
        "percent_value": "percent_rank_vertical_swing_path"
    },
    {
        "label": "",
        "value": "acceleration",
        "percent_value": "percent_rank_acceleration"
    },
    {
        "label": "",
        "value": "ideal_angle_rate",
        "percent_value": "percent_rank_ideal_angle_rate"
    }
]
