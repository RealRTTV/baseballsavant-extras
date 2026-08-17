export function zScoreToPercentile(z: number): number {
    const cdf: number = 0.5 * (1 + erf(z / Math.SQRT2));
    return 100.0 * cdf;
}

export function percentileToZScore(percentile: number): number {
    percentile /= 100.0;
    return inverseCDF(percentile);
}

/** Abramowitz & Stegun Approximation */
export function erf(x: number): number {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = (x < 0) ? -1 : 1;
    const absX = Math.abs(x);

    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return sign * y;
}

/**
 * Acklam's rational approximation, |relative error| < 1.15e-9.
 */
// @ts-ignore
export function inverseCDF(p: number): number {
    const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
    const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
    const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

    const P_LOW = 0.02425;
    const P_HIGH = 1 - P_LOW;

    if (p < P_LOW) {
        const q = Math.sqrt(-2 * Math.log(p));
        // @ts-ignore
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }

    if (p > P_HIGH) {
        const q = Math.sqrt(-2 * Math.log(1 - p));
        // @ts-ignore
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }

    const q = p - 0.5;
    const r = q * q;

    // @ts-ignore
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

export function clamp(x: number, min: number, max: number): number {
    if (!isFinite(x)) {
        return min;
    }
    return Math.max(min, Math.min(max, x))
}

export function lerp(a: number, b: number, delta: number): number {
    return a + (b - a) * delta;
}
