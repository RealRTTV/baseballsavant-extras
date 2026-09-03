import TOML, {type TomlTable} from "smol-toml";
import * as BATTING_VALUE from "@/utils/stats/batting_value.ts";
import * as BATTING_AND_PITCHING from "@/utils/stats/batting-and-pitching.ts";
import * as BATTING_ONLY from "@/utils/stats/batting.ts";
import * as CATCHING from "@/utils/stats/catching.ts";
import * as FIELDING from "@/utils/stats/fielding.ts";
import * as BASERUNNING from "@/utils/stats/baserunning.ts";
import * as PITCHING_VALUE from "@/utils/stats/pitcher_value.ts";
import * as PITCHING_ONLY from "@/utils/stats/pitching.ts";
import type {ExtendedPercentileProperty, PercentileProperty, PercentileSpec} from "@/utils/stats";
import {setTextareaConsoleError} from "@/entrypoints/sidepanel/textarea-helper.ts";
import {ALL_REGISTERED_CUSTOM_STAT_PROPERTIES} from "@/utils/custom-stats.ts";
import {DEFAULT_CONFIG} from "@/utils/config-consts.ts";

export type ParsedConfig = {
    percentiles: PercentileSpec,
    activeSeasons: number[],
    activeStats: ExtendedPercentileProperty[],
    allStats: ExtendedPercentileProperty[],
}

export const SAVANT_EXTRAS_CONFIG_STRING = storage.defineItem('local:config', {
    fallback: DEFAULT_CONFIG,
});

export const ALL_PERCENTILE_PROPERTIES: (activeStats: ExtendedPercentileProperty[]) => PercentileProperty[] = (activeStats) => [
    ...Object.values(BATTING_VALUE),
    ...Object.values(PITCHING_VALUE),
    ...Object.values(BATTING_AND_PITCHING),
    ...Object.values(BATTING_ONLY),
    ...Object.values(PITCHING_ONLY),
    ...Object.values(CATCHING),
    ...Object.values(FIELDING),
    ...Object.values(BASERUNNING),
    ...activeStats,
];

function mapValueStringsToPercentileProperties(values: string[] | undefined, allStats: ExtendedPercentileProperty[]): PercentileProperty[] {
    if (values === undefined || !Array.isArray(values) || values.some(v => typeof v !== 'string')) {
        throw new Error(`percentile properties category must be an array of strings, got ${typeof values}`);
    }

    return values.map(value => {
        const match = ALL_PERCENTILE_PROPERTIES(allStats).find(p => p.value === value);
        if (match === undefined) {
            throw new Error(`unknown percentile property ${value}`);
        }
        return match;
    })
}

function parseConfig(toml: TomlTable): ParsedConfig {
    const allStats: ExtendedPercentileProperty[] = ALL_REGISTERED_CUSTOM_STAT_PROPERTIES;
    const activeStats: ExtendedPercentileProperty[] = ((toml['active-stats'] as any)['stats'] as string[]).map(name => allStats.find(stat => stat.value === name)!);
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
    const percentiles = parsePercentileConfig(toml['percentiles'] as Record<string, any>, allStats);

    return {
        percentiles: percentiles,
        activeSeasons: activeSeasons,
        activeStats: activeStats,
        allStats: allStats,
    }
}

function parsePercentileConfig(percentiles: Record<string, any>, allStats: ExtendedPercentileProperty[]): PercentileSpec {
    return {
        batterValue: {
            title: "Value",
            props: mapValueStringsToPercentileProperties(percentiles['batter-value'], allStats),
            image: "slider-trophy.png",
            altImage: "Trophy",
        },
        batting: {
            title: "Batting",
            props: mapValueStringsToPercentileProperties(percentiles['batting'], allStats),
            image: "slider-batter.png",
            altImage: "Batter",
        },
        catching: {
            title: "Catching",
            props: mapValueStringsToPercentileProperties(percentiles['catching'], allStats),
            image: "slider-catcher.png",
            altImage: "Catcher",
        },
        fielding: {
            title: "Fielding",
            props: mapValueStringsToPercentileProperties(percentiles['fielding'], allStats),
            image: "slider-fielder.png",
            altImage: "Fielder",
        },
        running: {
            title: "Running",
            props: mapValueStringsToPercentileProperties(percentiles['running'], allStats),
            image: "slider-runner.png",
            altImage: "Running",
        },
        pitcherValue: {
            title: "Value",
            props: mapValueStringsToPercentileProperties(percentiles['pitcher-value'], allStats),
            image: "slider-trophy.png",
            altImage: "Trophy",
        },
        pitching: {
            title: "Pitching",
            props: mapValueStringsToPercentileProperties(percentiles['pitching'], allStats),
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
