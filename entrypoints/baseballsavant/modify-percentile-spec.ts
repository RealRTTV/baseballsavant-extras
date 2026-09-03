import type {PercentileSpec} from "@/utils/stats/module.ts";

export function modifyPercentileSpec(percentileSpec: PercentileSpec) {
    (globalThis as any).__savantPercentileSpec = percentileSpec;
    const newPercentileSpec: PercentileSpec = (globalThis as any).__savantNewPercentileSpec;
    Object.assign(percentileSpec, newPercentileSpec);
}
