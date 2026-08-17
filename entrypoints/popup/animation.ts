import {clamp} from "@/utils/shared/math.ts";
import {colorForPercentile} from "@/utils/shared/colors.ts";
import {percentilePropertyValue} from "@/entrypoints/popup/module.ts";
import type {PercentileProperty} from "@/utils/shared/stats";

function setMetricToPercentile(metric: Element, percentile: number) {
    const property: PercentileProperty = (metric as any).__percentileProperty;
    const valueText = metric.querySelector('.value-text')!;
    const metricBounds = metric.getBoundingClientRect();
    const backgroundRect: SVGRectElement = metric.querySelector('.background-rect')!;
    const circleBulb: SVGGElement = metric.querySelector('.circle-bulb')!;
    const circleBulbCircle = circleBulb.querySelector('circle')!;
    const circleBulbText = circleBulb.querySelector('text')!;
    const circleBounds = circleBulb.getBoundingClientRect();

    const circleCenter = {
        x: circleBounds.x + circleBounds.width / 2,
        y: circleBounds.y + circleBounds.height / 2
    };
    const targetX = 125 + percentile * (metricBounds.width - 125 - 35 - 10) + 10;

    const targetColor = colorForPercentile(percentile * 100.0);
    circleBulb.style.transform = `translate(${targetX}px, ${circleCenter.y - metricBounds.y}px)`;
    circleBulbCircle.setAttribute('fill', targetColor);
    circleBulbText.textContent = `${clamp(Math.round(percentile * 100.0), 1, 100)}`;
    circleBulbText.setAttribute('font-size', `${clamp(16 - circleBulbText.textContent.length * 2, 6, 12)}`);
    backgroundRect.setAttribute('style', `width: ${percentile * (metricBounds.width - 125 - 35 - 10) + 10}px`);
    backgroundRect.setAttribute('fill', targetColor);
    valueText.textContent = percentilePropertyValue(property, percentile * 100.0);
}

function tickMetric(metric: Element, dt: number, mouse: { x: number; y: number }) {
    const metricBounds = metric.getBoundingClientRect();

    const initialTagetX = mouse.x - metricBounds.x;
    const targetPercentile = clamp((initialTagetX - 125 - 10) / (metricBounds.width - 125 - 35 - 10), 0, 1);
    setMetricToPercentile(metric, targetPercentile);
}

function onAnimationFrame(dt: number, mouse: { x: number; y: number }) {
    const metrics = Array.from(document.querySelectorAll('.pct-metric').values());

    // metrics not loaded yet
    if (metrics.length === 0) {
        return;
    }

    for (const metric of metrics) {
        tickMetric(metric, dt, mouse);
    }
}

(() => {
    const mouse = {x: 0, y: 0};

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    let lastTimestampMS = performance.now();

    function onAnimationFrameHandler(timestampMs: number) {
        const dt = (timestampMs - lastTimestampMS) / 1000;
        lastTimestampMS = timestampMs;

        onAnimationFrame(dt, mouse);

        requestAnimationFrame(onAnimationFrameHandler);
    }

    requestAnimationFrame(onAnimationFrameHandler);
})()