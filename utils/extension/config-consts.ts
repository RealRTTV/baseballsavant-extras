import type {PercentileProperty} from "@/utils/shared/stats";
import * as BATTING_VALUE from "@/utils/shared/stats/batting_value.ts";
import * as BATTING_AND_PITCHING from "@/utils/shared/stats/batting-and-pitching.ts";
import * as BATTING_ONLY from "@/utils/shared/stats/batting.ts";
import * as CATCHING from "@/utils/shared/stats/catching.ts";
import * as FIELDING from "@/utils/shared/stats/fielding.ts";
import * as BASERUNNING from "@/utils/shared/stats/baserunning.ts";
import * as PITCHING_VALUE from "@/utils/shared/stats/pitcher_value.ts";
import * as PITCHING_ONLY from "@/utils/shared/stats/pitching.ts";

export const DEFAULT_CONFIG: string = `batter-value = [
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
]`;

export const ALL_PERCENTILE_PROPERTIES: PercentileProperty[] = [
    ...Object.values(BATTING_VALUE),
    ...Object.values(PITCHING_VALUE),
    ...Object.values(BATTING_AND_PITCHING),
    ...Object.values(BATTING_ONLY),
    ...Object.values(PITCHING_ONLY),
    ...Object.values(CATCHING),
    ...Object.values(FIELDING),
    ...Object.values(BASERUNNING),
];