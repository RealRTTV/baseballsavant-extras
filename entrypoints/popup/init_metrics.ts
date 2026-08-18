import './style.css';

import {ALL_STATS_SPEC} from "@/utils/shared/stats/registry.ts";
import {clamp} from "@/utils/shared/math.ts";
import {
    type PercentileCategory,
    type PercentileProperty,
    type PercentileSpec
} from "@/utils/shared/stats";
import {colorForPercentile} from "@/utils/shared/colors.ts";
import {percentilePropertyValue} from "@/entrypoints/popup/module.ts";

const AVAILABLE_PERCENTILE_RANKINGS: HTMLElement = document.getElementById('available-pct-rankings')!;

function generatePercentileMetric(property: PercentileProperty, ordinal: number = 0, percentile: number): Element[] {
    const color = colorForPercentile(percentile);

    const div = document.createElement('div');
    div.setAttribute('class', 'pct-metric-container');
    div.setAttribute('draggable', 'true');
    div.innerHTML = `
    <svg class="pct-metric">
        <rect class="hover-rect" width="100%" height="100%" rx="8" fill="lightblue" opacity="0"/>
        <g transform="translate(125, 0)">
            <rect style="width: calc(100% - 125px - 35px)" height="5" fill="#c7dcdc" y="7.5"/>
            <rect class="background-rect" style="width: calc(${percentile / 100.0} * (100% - 125px - 35px - 10px) + 10px)" height="20" fill="${color}" y="0"/>
            <rect width="2" height="20" opacity="0.3" style="x: calc(10px - 1px)" fill="#fff"/>
            <rect width="2" height="20" opacity="0.3" style="x: calc(0.50 * (100% - 125px - 35px - 10px) + 10px - 1px)" fill="#fff"/>
            <rect width="2" height="20" opacity="0.3" style="x: calc((100% - 125px - 35px - 10px) + 10px - 10px - 1px)" fill="#fff"/>
        </g>
        <text class="label-text" dominant-baseline="middle" text-anchor="end" x="120" y="10" font-size="12" fill="#666">${property.label}</text>
        <text class="value-text" dominant-baseline="middle" text-anchor="end" x="100%" y="10" font-size="12" fill="#666">${percentilePropertyValue(property, percentile)}</text>
        <g class="circle-bulb" style="transform: translate(calc(125px + ${percentile / 100.0} * (100% - 125px - 35px - 10px) + 10px), 10px)">
            <circle r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text dominant-baseline="middle" text-anchor="middle" fill="#fff" y="1" font-size="12" font-weight="bold">${clamp(Math.round(percentile), 1, 100)}</text>
        </g>
    </svg>
    `;
    div.onmouseenter = () => { div.querySelector('.hover-rect')!.style.opacity = '0.3'; };
    div.onmouseleave = () => { div.querySelector('.hover-rect')!.style.opacity = '0.0'; };
    (div.firstElementChild as any).__percentileProperty = property;
    const divider = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    divider.setAttribute('class', 'pct-metric-divider');
    divider.innerHTML = `
    <path d="M 80 1.5 L 0 1.5" stroke="rgb(57, 144, 152)" stroke-width="1" stroke-dasharray="6 3" opacity="1" style="transform: translate(40px, 0)"/>
    <path d="M 0 1.5 L 30 1.5" stroke="rgb(57, 144, 152)" stroke-width="1" stroke-dasharray="6 3" opacity="1" style="transform: translate(calc(100% - 30px), 0)"/>
    `;
    return ordinal === 0 ? [div] : [divider, div];
}

function generatePercentileCategory(category: PercentileCategory): Element[] {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    title.setAttribute('class', 'pct-group-title');
    title.innerHTML = `
        <rect fill="#399098" width="100%" height="2px" y="34"/>
        <image href="${category.image}" style="height: 40px; width: 40px" alt="${category.altImage}"/>
        <text font-size="16" x="40" y="28" font-weight="bold">${category.title}</text>
    `;

    const metrics = document.createElement('div');
    metrics.className = 'pct-metrics';
    metrics.append(...category.props.flatMap((prop, idx) => generatePercentileMetric(prop, idx, 1)));

    return [title, metrics];
}

function generatePercentileSpec(spec: PercentileSpec): Element[] {
    return Object.values(spec).flatMap(generatePercentileCategory);
}

function postProcessMetrics() {
    const metricContainers: HTMLDivElement[] = Array.from(document.querySelectorAll('.pct-metric-container').values()) as HTMLDivElement[];

    for (const metricContainer of metricContainers) {
        const metric: SVGSVGElement = metricContainer.firstElementChild! as SVGSVGElement;
        const text = metric.querySelector('.label-text')!;
        const hoverRect: SVGRectElement = metric.querySelector('.hover-rect')!;
        const metricBounds = metric.getBoundingClientRect();
        const textBounds = text.getBoundingClientRect();
        const leftEdge = 120 - textBounds.width - 4;
        const width = metricBounds.width - leftEdge + 4;
        hoverRect.setAttribute('x', `${leftEdge}`);
        hoverRect.setAttribute('width', `${width}`);
    }
}

AVAILABLE_PERCENTILE_RANKINGS.append(...generatePercentileSpec(ALL_STATS_SPEC));
postProcessMetrics();
