import './style.css';

import {ALL_STATS_SPEC} from "@/utils/shared/stats/registry.ts";
import type {PercentileCategory, PercentileProperty, PercentileSpec} from "@/utils/main/modify-percentile-spec.ts";

const AVAILABLE_PERCENTILE_RANKINGS: HTMLElement = document.getElementById('available-pct-rankings')!;

function generatePercentileMetric(property: PercentileProperty, ordinal: number = 0, value: string, percentile: number, color: string): string {
    return `
        <svg class="pct-metric">
            <g transform="translate(85, 0)">
            <rect style="width: calc(100% - 85px - 35px)" height="5" fill="#c7dcdc" y="7.5"/>
                <rect style="width: calc(${percentile / 100.0} * (100% - 85px - 35px - 12px) + 12px)" height="20" fill="${color}" y="0"/>
                <rect width="2" height="20" opacity="0.3" style="x: calc(12px - 1px)" fill="#fff"/>
                <rect width="2" height="20" opacity="0.3" style="x: calc(0.5 * (100% - 85px - 35px) - 1px)" fill="#fff"/>
                <rect width="2" height="20" opacity="0.3" style="x: calc((100% - 85px - 35px) - 12px - 1px)" fill="#fff"/>
            </g>
            <text dominant-baseline="middle" text-anchor="end" x="80" y="10" font-size="12" fill="#666">${property.label}</text>
            <text dominant-baseline="middle" text-anchor="end" x="100%" y="10" font-size="12" fill="#666">${value}</text>
            <g style="transform: translate(calc(85px + ${percentile / 100.0} * (100% - 85px - 35px - 12px) + 12px), 10px)">
                <circle r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
                <text dominant-baseline="middle" text-anchor="middle" fill="#fff" y="1" font-size="12" font-weight="bold">${Math.round(percentile)}</text>
            </g>
            ${ordinal === 0 ? '' : `
            <path d="M80,-1.5L0,-1.5" stroke="rgb(57, 144, 152)" stroke-width="1" stroke-dasharray="6 3" opacity="1"/>
            <path d="M0,-1.5L30,-1.5" stroke="rgb(57, 144, 152)" stroke-width="1" stroke-dasharray="6 3" opacity="1" style="transform: translate(calc(100% - 30px), 0)"/>
            `}
        </svg>
    `;
}

function generatePercentileCategory(category: PercentileCategory): string {
    return `
    <svg class="pct-group-title">
        <rect fill="#399098" width="100%" height="2px" y="34"/>
        <image href="${category.image}" style="height: 40px; width: 40px" alt="${category.altImage}"/>
        <text font-size="16" x="40" y="28" font-weight="bold">${category.title}</text>
    </svg>
    <div class="pct-metrics">
    ${category.props.map((prop, idx) => generatePercentileMetric(prop, idx, '.400', 96, 'rgb(216, 33, 41)')).join('')}
    </div>
    `;
}

function generatePercentileSpec(spec: PercentileSpec): string {
    return Object.values(spec).map(generatePercentileCategory).join('');
}

console.log(AVAILABLE_PERCENTILE_RANKINGS.innerHTML = generatePercentileSpec(ALL_STATS_SPEC));

console.log(document.body);
