import TOML, {type TomlTable} from "smol-toml";
import type {PercentileProperty, PercentileSpec} from "@/utils/shared/stats";
import {ALL_PERCENTILE_PROPERTIES, DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError} from "@/entrypoints/popup/textarea-helper.ts";

export const SAVANT_EXTRAS_CONFIG_STRING = storage.defineItem('local:config', {
    fallback: DEFAULT_CONFIG,
});

function mapValueStringsToPercentileProperties(values: string[] | undefined): PercentileProperty[] {
    if (values === undefined || !Array.isArray(values) || values.some(v => typeof v !== 'string')) {
        return [];
    }

    return values.map(value => {
        const match = ALL_PERCENTILE_PROPERTIES.find(p => p.value === value);
        if (match === undefined) {
            throw new Error(`unknown percentile property ${value}`);
        }
        return match;
    })
}

function parseTOMLConfig(toml: Record<string, any>): PercentileSpec {
    console.log('ran parseTOMLConfig');

    return {
        batterValue: {
            title: "Batter Value",
            props: mapValueStringsToPercentileProperties(toml['batter-value']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
            altImage: "Trophy",
        },
        batting: {
            title: "Batting",
            props: mapValueStringsToPercentileProperties(toml['batting']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-batter.png",
            altImage: "Batter",
        },
        catching: {
            title: "Catching",
            props: mapValueStringsToPercentileProperties(toml['catching']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-catcher.png",
            altImage: "Catcher",
        },
        fielding: {
            title: "Fielding",
            props: mapValueStringsToPercentileProperties(toml['fielding']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-fielder.png",
            altImage: "Fielder",
        },
        running: {
            title: "Running",
            props: mapValueStringsToPercentileProperties(toml['running']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-runner.png",
            altImage: "Running",
        },
        pitcherValue: {
            title: "Pitcher Value",
            props: mapValueStringsToPercentileProperties(toml['pitcher-value']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-trophy.png",
            altImage: "Trophy",
        },
        pitching: {
            title: "Pitching",
            props: mapValueStringsToPercentileProperties(toml['pitching']),
            image: "https://baseballsavant.mlb.com/sections/player-update/images/sliders/slider-pitcher.png",
            altImage: "Pitching",
        },
    }
}

let CURRENT_PERCENTILE_SPEC: PercentileSpec = parseTOMLConfig(TOML.parse(DEFAULT_CONFIG));

export function onTOMLConfig(toml: TomlTable, toml_string: string) {
    CURRENT_PERCENTILE_SPEC = parseTOMLConfig(toml);
    SAVANT_EXTRAS_CONFIG_STRING.setValue(toml_string).catch(e => setTextareaConsoleError(e));

    console.log(CURRENT_PERCENTILE_SPEC);
}

function initializeConfigCache() {
    SAVANT_EXTRAS_CONFIG_STRING.getValue().then(toml_string => {
        CURRENT_PERCENTILE_SPEC = parseTOMLConfig(TOML.parse(toml_string));
    });
    SAVANT_EXTRAS_CONFIG_STRING.watch(toml_string => {
        CURRENT_PERCENTILE_SPEC = parseTOMLConfig(TOML.parse(toml_string));
    })
}

export function getConfigPercentileSpec(): PercentileSpec {
    return CURRENT_PERCENTILE_SPEC;
}

initializeConfigCache();
