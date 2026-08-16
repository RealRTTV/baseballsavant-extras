import {FIRST_PITCH_STRIKE_CODE} from "@/utils/shared/stats/custom_stats";
import type {PercentileSpec} from "@/utils/shared/stats/module.ts";

export function modifyPercentileSpec(percentileSpec: PercentileSpec) {
    console.log(Object.values(percentileSpec).flatMap(e => e.props));

    (globalThis as any).__savantPercentileSpec = percentileSpec;
    percentileSpec.pitching.props.push(FIRST_PITCH_STRIKE_CODE.property);
}