export const DEFAULT_CONFIG: string = `[percentiles]
batter-value = [
  "swing_take_run_value",
  "runner_run_value",
  "fielding_run_value"
]
batting = [
  "xwoba",
  "xba",
  "xslg",
  "exit_velocity_avg",
  "barrel_batted_rate",
  "hard_hit_percent",
  "sweet_spot_percent",
  "swing_speed",
  "squared_up_swing",
  "chase_percent",
  "whiff_percent",
  "k_percent",
  "bb_percent"
]
catching = [
  "blocks_above_average",
  "cs_above_average",
  "fielding_run_value_framing",
  "pop_2b"
]
fielding = [
  "oaa",
  "fielding_run_value_arm",
  "arm_overall"
]
running = [ "sprint_speed" ]
pitcher-value = [
  "swing_take_run_value",
  "pitch_run_value_fastball",
  "pitch_run_value_breaking",
  "pitch_run_value_offspeed"
]
pitching = [
  "xera",
  "xba",
  "fastball_velo",
  "exit_velocity_avg",
  "chase_percent",
  "whiff_percent",
  "k_percent",
  "bb_percent",
  "barrel_batted_rate",
  "hard_hit_percent",
  "groundballs_percent",
  "fastball_extension"
]

[active-seasons]
include-current = false
seasons = []

[active-stats]
stats = []`;
