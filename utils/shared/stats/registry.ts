import {type PercentileProperty, type PercentileSpec} from "@/utils/shared/stats";
import * as BATTING_VALUE from "./batting_value";
import * as BATTING_AND_PITCHING from "./batting_and_pitching";
import * as PITCHING_VALUE from "./pitcher_value";
import * as PITCHING_ONLY from "./pitching";
import * as CATCHING from "./catching";
import * as FIELDING from "./fielding";
import * as BASERUNNING from "./baserunning";
import * as BATTING_ONLY from "./batting";

const ALL_PROPERTIES: PercentileProperty[] = [
    ...Object.values(BATTING_VALUE),
    ...Object.values(PITCHING_VALUE),
    ...Object.values(BATTING_AND_PITCHING),
    ...Object.values(BATTING_ONLY),
    ...Object.values(PITCHING_ONLY),
    ...Object.values(CATCHING),
    ...Object.values(FIELDING),
    ...Object.values(BASERUNNING),
];

const CURRENT_STATS_SPEC: PercentileSpec = {
    batterValue: {
        title: "Batter Value",
        props: [
            BATTING_VALUE.BATTING_RUN_VALUE,
            BATTING_VALUE.BASERUNNING_RUN_VALUE,
            BATTING_VALUE.FIELDING_RUN_VALUE
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
        altImage: "Trophy",
    },
    batting: {
        title: "Batting",
        props: [
            BATTING_AND_PITCHING.EXPECTED_WEIGHTED_ON_BASE_AVERAGE,
            BATTING_AND_PITCHING.EXPECTED_BATTING_AVERAGE,
            BATTING_ONLY.EXPECTED_SLUGGING,
            BATTING_AND_PITCHING.AVERAGE_EXIT_VELO,
            BATTING_AND_PITCHING.BARREL_RATE,
            BATTING_AND_PITCHING.HARD_HIT_RATE,
            BATTING_ONLY.LA_SWEET_SPOT_RATE,
            BATTING_ONLY.BAT_SPEED,
            BATTING_ONLY.SQUARED_UP_RATE,
            BATTING_AND_PITCHING.CHASE_RATE,
            BATTING_AND_PITCHING.WHIFF_RATE,
            BATTING_AND_PITCHING.STRIKEOUT_RATE,
            BATTING_AND_PITCHING.WALK_RATE,
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-batter.png",
        altImage: "Batter",
    },
    catching: {
        title: "Catching",
        props: [
            CATCHING.BLOCKS_ABOVE_AVERAGE,
            CATCHING.CAUGHT_STEALING_ABOVE_AVERAGE,
            CATCHING.FRAMING,
            CATCHING.POP_TIME,
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-catcher.png",
        altImage: "Catcher",
    },
    fielding: {
        title: "Fielding",
        props: [
            FIELDING.OUTS_ABOVE_AVERAGE,
            FIELDING.ARM_VALUE,
            FIELDING.ARM_STRENGTH,
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-fielder.png",
        altImage: "Fielder",
    },
    running: {
        title: "Running",
        props: [
            BASERUNNING.SPRINT_SPEED,
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-runner.png",
        altImage: "Running",
    },
    pitcherValue: {
        title: "Pitcher Value",
        props: [
            PITCHING_VALUE.PITCHING_RUN_VALUE,
            PITCHING_VALUE.FASTBALL_RUN_VALUE,
            PITCHING_VALUE.BREAKING_RUN_VALUE,
            PITCHING_VALUE.OFFSPEED_RUN_VALUE,
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
        altImage: "Trophy",
    },
    pitching: {
        title: "Pitching",
        props: [
            PITCHING_ONLY.EXPECTED_ERA,
            BATTING_AND_PITCHING.EXPECTED_BATTING_AVERAGE,
            PITCHING_ONLY.FASTBALL_VELO,
            BATTING_AND_PITCHING.AVERAGE_EXIT_VELO,
            BATTING_AND_PITCHING.CHASE_RATE,
            BATTING_AND_PITCHING.WHIFF_RATE,
            BATTING_AND_PITCHING.STRIKEOUT_RATE,
            BATTING_AND_PITCHING.WALK_RATE,
            BATTING_AND_PITCHING.BARREL_RATE,
            BATTING_AND_PITCHING.HARD_HIT_RATE,
            BATTING_AND_PITCHING.GROUNDBALL_RATE,
            PITCHING_ONLY.EXTENSION,
        ],
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-pitcher.png",
        altImage: "Pitching",
    },
}
