import {FIRST_PITCH_STRIKE} from "@/utils/shared/stats/custom_stats";

export function modifyPercentileSpec(percentileSpec: Record<string, any>) {
    percentileSpec.pitching.props.push({
        "label": "FPS %",
        "value": FIRST_PITCH_STRIKE.name,
        "percent_value": `percent_rank_${FIRST_PITCH_STRIKE.name}`
    });
}