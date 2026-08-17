import {formatDisplayType, isExtendedPercentileProperty, type PercentileProperty} from "@/utils/shared/stats";
import {clamp, percentileToZScore} from "@/utils/shared/math.ts";
import {getDistributionDataOrDefault} from "@/utils/extension/statcast.ts";

export function percentilePropertyValue(property: PercentileProperty, percentile: number): string {
    if (!isExtendedPercentileProperty(property)) {
        return '--';
    }

    const zScore = percentileToZScore(clamp(property.invert === true ? 100 - percentile : percentile, 0.1, 99.9));
    console.log(zScore);
    const { mean, stdev } = getDistributionDataOrDefault(property, new Date().getFullYear());
    return formatDisplayType(mean + zScore * stdev, property.display_type);
}
