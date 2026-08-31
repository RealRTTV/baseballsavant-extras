import TOML, {type TomlTable} from "smol-toml";
import * as BATTING_VALUE from "@/utils/shared/stats/batting_value.ts";
import * as BATTING_AND_PITCHING from "@/utils/shared/stats/batting-and-pitching.ts";
import * as BATTING_ONLY from "@/utils/shared/stats/batting.ts";
import * as CATCHING from "@/utils/shared/stats/catching.ts";
import * as FIELDING from "@/utils/shared/stats/fielding.ts";
import * as BASERUNNING from "@/utils/shared/stats/baserunning.ts";
import * as PITCHING_VALUE from "@/utils/shared/stats/pitcher_value.ts";
import * as PITCHING_ONLY from "@/utils/shared/stats/pitching.ts";
import type {PercentileProperty, PercentileSpec} from "@/utils/shared/stats";
import {DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError} from "@/entrypoints/popup/textarea-helper.ts";
import {type CustomStat, FIRST_PITCH_STRIKE_CODE} from "@/utils/shared/stats/custom_stats";

export type ParsedConfig = {
    percentiles: PercentileSpec,
    activeSeasons: number[],
    activeStats: CustomStat<any>[],
    allStats: CustomStat<any>[],
}

export const SAVANT_EXTRAS_CONFIG_STRING = storage.defineItem('local:config', {
    fallback: DEFAULT_CONFIG,
});

export const ALL_PERCENTILE_PROPERTIES: (activeStats: CustomStat<any>[]) => PercentileProperty[] = (activeStats) => [
    ...Object.values(BATTING_VALUE),
    ...Object.values(PITCHING_VALUE),
    ...Object.values(BATTING_AND_PITCHING),
    ...Object.values(BATTING_ONLY),
    ...Object.values(PITCHING_ONLY),
    ...Object.values(CATCHING),
    ...Object.values(FIELDING),
    ...Object.values(BASERUNNING),
    ...activeStats.map(stat => stat.property),
];

function mapValueStringsToPercentileProperties(values: string[] | undefined, newlyActiveStats: CustomStat<any>[]): PercentileProperty[] {
    if (values === undefined || !Array.isArray(values) || values.some(v => typeof v !== 'string')) {
        throw new Error(`percentile properties category must be an array of strings, got ${typeof values}`);
    }

    return values.map(value => {
        const match = ALL_PERCENTILE_PROPERTIES(newlyActiveStats).find(p => p.value === value);
        if (match === undefined) {
            throw new Error(`unknown percentile property ${value}`);
        }
        return match;
    })
}

function parseConfig(toml: TomlTable): ParsedConfig {
    const activeStats: CustomStat<any>[] = [ FIRST_PITCH_STRIKE_CODE ];
    const activeSeasons = (() => {
        const entry = toml['active-seasons'] as Record<string, any>;
        const includeCurrent = entry['include-current'] === true;
        const currentSeason = new Date().getFullYear();
        const seasons = (entry['seasons'] ?? []) as number[];
        if (includeCurrent && !seasons.includes(currentSeason)) {
            seasons.push(currentSeason);
        }
        seasons.sort((a, b) => b - a); // descending
        return seasons;
    })();
    const percentiles = parsePercentileConfig(toml['percentiles'] as Record<string, any>, activeStats);
    const allStats = [FIRST_PITCH_STRIKE_CODE]; // todo

    return {
        percentiles: percentiles,
        activeSeasons: activeSeasons,
        activeStats: activeStats,
        allStats: allStats,
    }
}

function parsePercentileConfig(percentiles: Record<string, any>, newlyActiveStats: CustomStat<any>[]): PercentileSpec {
    return {
        batterValue: {
            title: "Value",
            props: mapValueStringsToPercentileProperties(percentiles['batter-value'], newlyActiveStats),
            image: "slider-trophy.png",
            altImage: "Trophy",
        },
        batting: {
            title: "Batting",
            props: mapValueStringsToPercentileProperties(percentiles['batting'], newlyActiveStats),
            image: "slider-batter.png",
            altImage: "Batter",
        },
        catching: {
            title: "Catching",
            props: mapValueStringsToPercentileProperties(percentiles['catching'], newlyActiveStats),
            image: "slider-catcher.png",
            altImage: "Catcher",
        },
        fielding: {
            title: "Fielding",
            props: mapValueStringsToPercentileProperties(percentiles['fielding'], newlyActiveStats),
            image: "slider-fielder.png",
            altImage: "Fielder",
        },
        running: {
            title: "Running",
            props: mapValueStringsToPercentileProperties(percentiles['running'], newlyActiveStats),
            image: "slider-runner.png",
            altImage: "Running",
        },
        pitcherValue: {
            title: "Value",
            props: mapValueStringsToPercentileProperties(percentiles['pitcher-value'], newlyActiveStats),
            image: "slider-trophy.png",
            altImage: "Trophy",
        },
        pitching: {
            title: "Pitching",
            props: mapValueStringsToPercentileProperties(percentiles['pitching'], newlyActiveStats),
            image: "slider-pitcher.png",
            altImage: "Pitching",
        },
    }
}

let CURRENT_CONFIG: ParsedConfig = parseConfig(TOML.parse(DEFAULT_CONFIG));

export function onConfigWrite(toml_string: string): ParsedConfig {
    const toml = TOML.parse(toml_string);
    CURRENT_CONFIG = parseConfig(toml);
    SAVANT_EXTRAS_CONFIG_STRING.setValue(toml_string).catch(e => setTextareaConsoleError(e));
    return CURRENT_CONFIG;
}

function initializeConfigCache() {
    SAVANT_EXTRAS_CONFIG_STRING.getValue().then(toml_string => {
        CURRENT_CONFIG = parseConfig(TOML.parse(toml_string));
    });
    SAVANT_EXTRAS_CONFIG_STRING.watch(toml_string => {
        CURRENT_CONFIG = parseConfig(TOML.parse(toml_string));
    })
}

export function getConfig(): ParsedConfig {
    return CURRENT_CONFIG;
}

initializeConfigCache();
