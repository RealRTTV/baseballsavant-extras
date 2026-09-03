import {modifyPercentileSpec} from "@/entrypoints/baseballsavant/modify-percentile-spec";
import {applyServerValsPatch} from "@/entrypoints/baseballsavant/server-vals-patch";
import {DisplayType, type ExtendedPercentileProperty, type PercentileSpec} from "@/utils/stats";

export default defineUnlistedScript(async () => {
    (globalThis as any).__savantExtras = {
        onPercentileSpec(percentileSpec: PercentileSpec) {
            try {
                applyServerValsPatch((globalThis as any).serverVals, (globalThis as any).__savantServerValsPatch);
                modifyPercentileSpec(percentileSpec);
            } catch (e) {
                console.error(e);
            }
        },

        onStatFormatting(
            threeDPNoInt: string[],       // 0.123 -> .123
            threeDP: string[],            // 0.123 -> 0.123
            twoDP: string[],              // 0.123 -> 0.12
            oneDP: string[],              // 0.123 -> 0.1
            zeroDP: string[],             // 0.123 -> 0
            withPercentOneDP: string[],   // 0.123 -> 12.3%
            withPercentZeroDP: string[],  // 0.123 -> 12%
            degrees: string[],            //    13 -> 13°
            feetAndInches: string[],      //    13 -> 1'1"
            stats: ExtendedPercentileProperty[]
        ) {
            for (const stat of stats) {
                const list: string[] = {
                    [DisplayType.ThreeDecimalPlaceNoIntegerPortion]: threeDPNoInt,
                    [DisplayType.ThreeDecimalPlace]: threeDP,
                    [DisplayType.TwoDecimalPlace]: twoDP,
                    [DisplayType.OneDecimalPlace]: oneDP,
                    [DisplayType.ZeroDecimalPlace]: zeroDP,
                    [DisplayType.WithPercentOneDecimalPlace]: withPercentOneDP,
                    [DisplayType.WithPercentZeroDecimalPlaces]: withPercentZeroDP,
                    [DisplayType.Degrees]: degrees,
                    [DisplayType.FeetAndInches]: feetAndInches,
                }[stat.display_type] ?? [];

                list.push(stat.value);
            }
        }
    };
});
