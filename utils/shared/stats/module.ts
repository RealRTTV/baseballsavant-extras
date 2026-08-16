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

    // todo, more here
};

export type ExtendedPercentileProperty = PercentileProperty & {
    /** Used in rendering the values on the popup */
    approx_mean: number,
    /** Used in rendering the values on the popup */
    approx_stdev: number,

    display_type: DisplayType,
};

export enum DisplayType {
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

export function formatDisplayType(value: number, display: DisplayType) {
    switch (display) {
        case DisplayType.ThreeDecimalPlaceNoIntegerPortion: return value.toFixed(3); // todo
        case DisplayType.ThreeDecimalPlace: return value.toFixed(3);
        case DisplayType.TwoDecimalPlace: return value.toFixed(2);
        case DisplayType.OneDecimalPlace: return value.toFixed(1);
        case DisplayType.ZeroDecimalPlace: return value.toFixed(0);
        case DisplayType.WithPercentOneDecimalPlace: return (value * 100.0).toFixed(1) + '%';
        case DisplayType.WithPercentZeroDecimalPlaces: return (value * 100.0).toFixed(0) + '%';
        case DisplayType.Degrees: return value.toFixed(1) + '°';
        case DisplayType.FeetAndInches: return `${Math.floor(value / 12)}'${value % 12}"`;
    }
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
        typeof (property as any).display_type === 'number';
}
