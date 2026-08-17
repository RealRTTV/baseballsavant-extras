import {clamp, lerp} from "@/utils/shared/math.ts";

type Color = {
    red: number;
    green: number;
    blue: number;
};

const hexToDecimal = (hex: string): number => parseInt(hex, 16);

function hexToColor(hex: string): Color {
    if (hex.startsWith("#")) {
        hex = hex.slice(1);
    }

    let r: string, g: string, b: string;
    if (hex.length === 3) {
        r = hex[0]!.repeat(2);
        g = hex[1]!.repeat(2);
        b = hex[2]!.repeat(2);
    } else if (hex.length === 6) {
        r = hex.slice(0, 2);
        g = hex.slice(2, 4);
        b = hex.slice(4, 6);
    } else {
        throw new Error('expected /\\#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})/');
    }

    return {
        red: hexToDecimal(r),
        green: hexToDecimal(g),
        blue: hexToDecimal(b),
    }
}

function colorToHex(color: Color): string {
    const encode = (num: number): string => num.toString(16).padStart(2, '0');

    return `#${encode(color.red)}${encode(color.green)}${encode(color.blue)}`;
}

function lerpColors(a: Color, b: Color, delta: number): Color {
    return {
        red: Math.round(lerp(a.red, b.red, delta)),
        green: Math.round(lerp(a.green, b.green, delta)),
        blue: Math.round(lerp(a.blue, b.blue, delta)),
    }
}

const COLORS: Color[] = ["#3661ad", "#b4cfd1", "#b4cfd1", "#d82129"].map(hexToColor);
const RANGES: number[] = [5, 45, 55, 95];

console.assert(COLORS.length == RANGES.length);

export function colorForPercentile(percentile: number): string {
    percentile = clamp(percentile, 0, 100);

    if (percentile <= RANGES.at(0)!) {
        return colorToHex(COLORS.at(0)!);
    }

    if (percentile >= RANGES.at(-1)!) {
        return colorToHex(COLORS.at(-1)!);
    }

    // last index such that RANGES[idx] <= percentile
    let idxLE = 0;
    while (idxLE + 1 < RANGES.length && RANGES[idxLE + 1]! <= percentile) {
        idxLE++;
    }

    const idxGT = idxLE + 1;

    const boundLE = RANGES[idxLE]!;
    const boundGT = RANGES[idxGT]!;

    const colorLE = COLORS[idxLE]!;
    const colorGT = COLORS[idxGT]!;

    const delta = (percentile - boundLE) / (boundGT - boundLE);

    const color = lerpColors(colorLE, colorGT, delta);

    return colorToHex(color);
}
