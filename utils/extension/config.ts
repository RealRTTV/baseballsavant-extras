import TOML, {type TomlTable} from "smol-toml";
import type {PercentileProperty, PercentileSpec} from "@/utils/shared/stats";
import {ALL_PERCENTILE_PROPERTIES, DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError} from "@/entrypoints/popup/textarea-helper.ts";
import {type CustomStat, FIRST_PITCH_STRIKE_CODE} from "@/utils/shared/stats/custom_stats";

export type ParsedConfig = {
    percentiles: PercentileSpec,
    activeYears: number[],
    activeStats: CustomStat<any>[], // todo
}

export const SAVANT_EXTRAS_CONFIG_STRING = storage.defineItem('local:config', {
    fallback: DEFAULT_CONFIG,
});

function mapValueStringsToPercentileProperties(values: string[] | undefined): PercentileProperty[] {
    if (values === undefined || !Array.isArray(values) || values.some(v => typeof v !== 'string')) {
        throw new Error(`percentile properties category must be an array of strings, got ${typeof values}`);
    }

    return values.map(value => {
        const match = ALL_PERCENTILE_PROPERTIES.find(p => p.value === value);
        if (match === undefined) {
            throw new Error(`unknown percentile property ${value}`);
        }
        return match;
    })
}

function parseConfig(toml: TomlTable): ParsedConfig {
    return {
        percentiles: parsePercentileConfig(toml['percentiles'] as Record<string, any>),
        activeYears: (() => {
            const entry = toml['active-years'] as Record<string, any>;
            const includeCurrent = entry['include-current'] === true;
            const currentYear = new Date().getFullYear();
            const years = (entry['years'] ?? []) as number[];
            if (includeCurrent && !years.includes(currentYear)) {
                years.push(currentYear);
            }
            years.sort((a, b) => b - a); // descending
            return years;
        })(),
        activeStats: [
            FIRST_PITCH_STRIKE_CODE,
        ],
    }
}

function parsePercentileConfig(percentiles: Record<string, any>): PercentileSpec {
    return {
        batterValue: {
            title: "Batter Value",
            props: mapValueStringsToPercentileProperties(percentiles['batter-value']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
            altImage: "Trophy",
        },
        batting: {
            title: "Batting",
            props: mapValueStringsToPercentileProperties(percentiles['batting']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-batter.png",
            altImage: "Batter",
        },
        catching: {
            title: "Catching",
            props: mapValueStringsToPercentileProperties(percentiles['catching']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-catcher.png",
            altImage: "Catcher",
        },
        fielding: {
            title: "Fielding",
            props: mapValueStringsToPercentileProperties(percentiles['fielding']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-fielder.png",
            altImage: "Fielder",
        },
        running: {
            title: "Running",
            props: mapValueStringsToPercentileProperties(percentiles['running']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-runner.png",
            altImage: "Running",
        },
        pitcherValue: {
            title: "Pitcher Value",
            props: mapValueStringsToPercentileProperties(percentiles['pitcher-value']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
            altImage: "Trophy",
        },
        pitching: {
            title: "Pitching",
            props: mapValueStringsToPercentileProperties(percentiles['pitching']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-pitcher.png",
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
