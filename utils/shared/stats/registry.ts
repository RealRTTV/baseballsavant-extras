import {type PercentileProperty, type PercentileSpec} from "@/utils/main/modify-percentile-spec";
import * as BATTING_VALUE from "./batting_value";
import * as BATTING_AND_PITCHING from "./batting_and_pitching";
import * as PITCHING_VALUE from "./pitcher_value";
import * as PITCHING_ONLY from "./pitching";
import * as CATCHING from "./catching";
import * as FIELDING from "./fielding";
import * as BASERUNNING from "./baserunning";
import * as BATTING_ONLY from "./batting";

const BATTER_VALUE_PROPERTIES: PercentileProperty[] = [...Object.values(BATTING_VALUE)]
const BATTING_PROPERTIES: PercentileProperty[] = [...Object.values(BATTING_AND_PITCHING), ...Object.values(BATTING_ONLY)]
const PITCHING_VALUE_PROPERTIES: PercentileProperty[] = [...Object.values(PITCHING_VALUE)]
const PITCHING_PROPERTIES: PercentileProperty[] = [...Object.values(BATTING_AND_PITCHING), ...Object.values(PITCHING_ONLY)]
const CATCHING_PROPERTIES: PercentileProperty[] = [...Object.values(CATCHING)]
const FIELDING_PROPERTIES: PercentileProperty[] = [...Object.values(FIELDING)]
const BASERUNNING_PROPERTIES: PercentileProperty[] = [...Object.values(BASERUNNING)]

export const ALL_STATS_SPEC: PercentileSpec = {
    batterValue: {
        title: "Batter Value",
        props: BATTER_VALUE_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
        altImage: "Batter Value",
    },
    batting: {
        title: "Batting",
        props: BATTING_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-batter.png",
        altImage: "Batter",
    },
    catching: {
        title: "Catching",
        props: CATCHING_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-catcher.png",
        altImage: "Catcher",
    },
    fielding: {
        title: "Fielding",
        props: FIELDING_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-fielder.png",
        altImage: "Fielder",
    },
    running: {
        title: "Running",
        props: BASERUNNING_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-runner.png",
        altImage: "Running",
    },
    pitcherValue: {
        title: "Pitcher Value",
        props: PITCHING_VALUE_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
        altImage: "Pitcher Value",
    },
    pitching: {
        title: "Pitching",
        props: PITCHING_PROPERTIES,
        image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-pitcher.png",
        altImage: "Pitching",
    }
};
