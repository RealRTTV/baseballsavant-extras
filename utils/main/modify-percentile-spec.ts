import {FIRST_PITCH_STRIKE} from "@/utils/shared/stats/custom_stats";

export type PercentileSpec = {
    batterValue: PercentileCategory,
    batting: PercentileCategory,
    catching: PercentileCategory,
    fielding: PercentileCategory,
    pitcherValue: PercentileCategory,
    pitching: PercentileCategory,
    running: PercentileCategory,
};

export type PercentileCategory = {
    title: string,
    props: PercentileProperty[],
    image: string,
    altImage: string,
};

export type PercentileProperty = {
    /** Display Name */
    label: string,
    /** Key to lookup in serverVals for */
    value: string,
    /** Key to lookup in serverVals for; automatically appends '_unrounded' for that one too */
    percent_value: string,

    // todo, more here
};

export function modifyPercentileSpec(percentileSpec: PercentileSpec) {
    console.log(Object.values(percentileSpec).flatMap(e => e.props));

    (globalThis as any).__savantPercentileSpec = percentileSpec;
    percentileSpec.pitching.props.push({
        "label": "FPS %",
        "value": FIRST_PITCH_STRIKE.name,
        "percent_value": `percent_rank_${FIRST_PITCH_STRIKE.name}`,
    });
}