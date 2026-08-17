import {FIRST_PITCH_STRIKE_CODE} from "@/utils/shared/stats/custom_stats";
import type {PercentileSpec} from "@/utils/shared/stats/module.ts";

export function modifyPercentileSpec(percentileSpec: PercentileSpec) {
    (globalThis as any).__savantPercentileSpec = percentileSpec;
    percentileSpec.pitching.props.push(FIRST_PITCH_STRIKE_CODE.property);
}