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

function generatePercentileMetric(property: PercentileProperty, ordinal: number = 0, percentile: number): Node {
    const color = colorForPercentile(percentile);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'pct-metric');
    svg.innerHTML = `
        <g transform="translate(85, 0)">
            <rect style="width: calc(100% - 85px - 35px)" height="5" fill="#c7dcdc" y="7.5"/>
            <rect class="background-rect" style="width: calc(${percentile / 100.0} * (100% - 85px - 35px - 10px) + 10px)" height="20" fill="${color}" y="0"/>
            <rect width="2" height="20" opacity="0.3" style="x: calc(10px - 1px)" fill="#fff"/>
            <rect width="2" height="20" opacity="0.3" style="x: calc(0.50 * (100% - 85px - 35px - 10px) + 10px - 1px)" fill="#fff"/>
            <rect width="2" height="20" opacity="0.3" style="x: calc((100% - 85px - 35px - 10px) + 10px - 10px - 1px)" fill="#fff"/>
        </g>
        <text class="label-text" dominant-baseline="middle" text-anchor="end" x="80" y="10" font-size="12" fill="#666">${property.label}</text>
        <text class="value-text" dominant-baseline="middle" text-anchor="end" x="100%" y="10" font-size="12" fill="#666">${percentilePropertyValue(property, percentile)}</text>
        <g class="circle-bulb" style="transform: translate(calc(85px + ${percentile / 100.0} * (100% - 85px - 35px - 10px) + 10px), 10px)">
            <circle r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
            <text dominant-baseline="middle" text-anchor="middle" fill="#fff" y="1" font-size="12" font-weight="bold">${clamp(Math.round(percentile), 1, 100)}</text>
        </g>
        ${ordinal === 0 ? '' : `
        <path d="M80,-1.5L0,-1.5" stroke="rgb(57, 144, 152)" stroke-width="1" stroke-dasharray="6 3" opacity="1"/>
        <path d="M0,-1.5L30,-1.5" stroke="rgb(57, 144, 152)" stroke-width="1" stroke-dasharray="6 3" opacity="1" style="transform: translate(calc(100% - 30px), 0)"/>
        `}
    `;

    (svg as any).__percentileProperty = property;

    return svg;
}

function generatePercentileCategory(category: PercentileCategory): Node[] {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    title.setAttribute('class', 'pct-group-title');
    title.innerHTML = `
        <rect fill="#399098" width="100%" height="2px" y="34"/>
        <image href="${category.image}" style="height: 40px; width: 40px" alt="${category.altImage}"/>
        <text font-size="16" x="40" y="28" font-weight="bold">${category.title}</text>
    `;

    const metrics = document.createElement('div');
    metrics.className = 'pct-metrics';
    metrics.append(...category.props.map((prop, idx) => generatePercentileMetric(prop, idx, 1)));

    return [title, metrics];
}

function generatePercentileSpec(spec: PercentileSpec): Node[] {
    return Object.values(spec).flatMap(generatePercentileCategory);
}

AVAILABLE_PERCENTILE_RANKINGS.append(...generatePercentileSpec(ALL_STATS_SPEC));
