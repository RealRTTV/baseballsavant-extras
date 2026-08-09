type RegisteredStat = {
    label: string,
    value: string,
    percent_value: string,
};

const REGISTERED_STATS: RegisteredStat[] = [
    {
        "label": "Barrels",
        "value": "barrel",
        "percent_value": "percent_rank_barrel"
    },
    {
        "label": "Barrel %",
        "value": "barrel_batted_rate",
        "percent_value": "percent_rank_barrel_batted_rate"
    },
    {
        "label": "Avg Exit Velo",
        "value": "exit_velocity_avg",
        "percent_value": "percent_rank_exit_velocity_avg"
    },
    {
        "label": "",
        "value": "exit_velocity_max",
        "percent_value": "percent_rank_exit_velocity_max"
    },
    {
        "label": "",
        "value": "launch_angle_avg",
        "percent_value": "percent_rank_launch_angle_avg"
    },
    {
        "label": "",
        "value": "xba",
        "percent_value": "percent_rank_xba"
    },
    {
        "label": "",
        "value": "xslg",
        "percent_value": "percent_rank_xslg"
    },
    {
        "label": "",
        "value": "xwoba",
        "percent_value": "percent_rank_xwoba"
    },
    {
        "label": "",
        "value": "woba",
        "percent_value": "percent_rank_woba"
    },
    {
        "label": "",
        "value": "hard_hit_percent",
        "percent_value": "percent_rank_hard_hit_percent"
    },
    {
        "label": "",
        "value": "xwobacon",
        "percent_value": "percent_rank_xwobacon"
    },
    {
        "label": "",
        "value": "wobacon",
        "percent_value": "percent_rank_wobacon"
    },
    {
        "label": "",
        "value": "k_percent",
        "percent_value": "percent_rank_k_percent"
    },
    {
        "label": "",
        "value": "bb_percent",
        "percent_value": "percent_rank_bb_percent"
    },
    {
        "label": "",
        "value": "sz_judge",
        "percent_value": "percent_rank_sz_judge"
    },
    {
        "label": "",
        "value": "whiff_percent",
        "percent_value": "percent_rank_whiff_percent"
    },
    {
        "label": "",
        "value": "chase_percent",
        "percent_value": "percent_rank_chase_percent"
    },
    {
        "label": "",
        "value": "ba",
        "percent_value": "percent_rank_ba"
    },
    {
        "label": "",
        "value": "bacon",
        "percent_value": "percent_rank_bacon"
    },
    {
        "label": "",
        "value": "xbacon",
        "percent_value": "percent_rank_xbacon"
    },
    {
        "label": "",
        "value": "babip",
        "percent_value": "percent_rank_babip"
    },
    {
        "label": "",
        "value": "obp",
        "percent_value": "percent_rank_obp"
    },
    {
        "label": "",
        "value": "slg",
        "percent_value": "percent_rank_slg"
    },
    {
        "label": "",
        "value": "xobp",
        "percent_value": "percent_rank_xobp"
    },
    {
        "label": "",
        "value": "iso",
        "percent_value": "percent_rank_iso"
    },
    {
        "label": "",
        "value": "xiso",
        "percent_value": "percent_rank_xiso"
    },
    {
        "label": "",
        "value": "sweet_spot_percent",
        "percent_value": "percent_rank_sweet_spot_percent"
    },
    {
        "label": "",
        "value": "distance_hr_avg",
        "percent_value": "percent_rank_distance_hr_avg"
    },
    {
        "label": "",
        "value": "groundballs_percent",
        "percent_value": "percent_rank_groundballs_percent"
    },
    {
        "label": "",
        "value": "airballs_percent",
        "percent_value": "percent_rank_airballs_percent"
    },
    {
        "label": "",
        "value": "pull_percent_airballs",
        "percent_value": "percent_rank_pull_percent_airballs"
    },
    {
        "label": "",
        "value": "avg_hyper_speed",
        "percent_value": "percent_rank_avg_hyper_speed"
    },
    {
        "label": "",
        "value": "avg_best_speed",
        "percent_value": "percent_rank_avg_best_speed"
    },
    {
        "label": "",
        "value": "pitch_run_value_fastball",
        "percent_value": "percent_rank_pitch_run_value_fastball"
    },
    {
        "label": "",
        "value": "pitch_run_value_breaking",
        "percent_value": "percent_rank_pitch_run_value_breaking"
    },
    {
        "label": "",
        "value": "pitch_run_value_offspeed",
        "percent_value": "percent_rank_pitch_run_value_offspeed"
    },
    {
        "label": "",
        "value": "speed_order",
        "percent_value": "percent_rank_speed_order"
    },
    {
        "label": "",
        "value": "pop_2b",
        "percent_value": "percent_rank_pop_2b"
    },
    {
        "label": "",
        "value": "arm_cs_2b",
        "percent_value": "percent_rank_arm_cs_2b"
    },
    {
        "label": "",
        "value": "oaa",
        "percent_value": "percent_rank_oaa"
    },
    {
        "label": "",
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
