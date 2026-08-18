import type {PercentileProperty} from "@/utils/shared/stats";

export function onMetricDragStart(metric: SVGSVGElement, event: Event) {
    const percentileProperty: PercentileProperty = (metric as any).__percentileProperty!;
    console.log(`${percentileProperty.label} dragged.`);
}
