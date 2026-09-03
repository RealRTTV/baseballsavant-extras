export type PercentileSpec = {
    batterValue: PercentileCategory,
    batting: PercentileCategory,
    catching: PercentileCategory,
    fielding: PercentileCategory,
    running: PercentileCategory,
    pitcherValue: PercentileCategory,
    pitching: PercentileCategory,
};

export type PercentileCategory = {
    title: string,
    props: PercentileProperty[],
    image: string,
    altImage: string,
};

export type PercentileProperty = {
    /** Display Name */
    label: string,
    /** Key to lookup in serverVals for */
    value: string,
    /** Key to lookup in serverVals for; automatically appends '_unrounded' for that one too */
    percent_value: string,

    /** Means that lower is better */
    invert?: boolean,
};

export type ExtendedPercentileProperty = PercentileProperty & {
    display_type: DisplayType,

    // todo: redo to a class hierarchy with a qualification_threshold(byPlayer: Record<number, T>): number. with an impl for NumeratorDenominatorCustomStat that 0.25 * Math.max(...byPlayer.map(player => player.denominator))
    qualification_threshold: number,
};

export const enum DisplayType {
    /** 0.123 -> .123 */
    ThreeDecimalPlaceNoIntegerPortion,
    /** 0.123 -> 0.123 */
    ThreeDecimalPlace,
    /** 1.234 -> 1.23 */
    TwoDecimalPlace,
    /** 1.234 -> 1.2 */
    OneDecimalPlace,
    /** 1.234 -> 1 */
    ZeroDecimalPlace,
    /** 0.123 -> 12.3% */
    WithPercentOneDecimalPlace,
    /** 0.123 -> 12% */
    WithPercentZeroDecimalPlaces,
    /** 13 -> 13.0° */
    Degrees,
    /** 13 -> 1'1" */
    FeetAndInches,
}

export function isPercentileProperty(property: any): property is PercentileProperty {
    return typeof property.label === 'string' &&
        typeof property.value === 'string' &&
        typeof property.percent_value === 'string';
}

export function isExtendedPercentileProperty(property: PercentileProperty): property is ExtendedPercentileProperty {
    return isPercentileProperty(property) &&
        typeof (property as any).approx_mean === 'number' &&
        typeof (property as any).approx_stdev === 'number' &&
        typeof (property as any).display_type === 'number' &&
        typeof (property as any).qualification_threshold === 'number';
}
