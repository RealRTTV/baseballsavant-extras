import {modifyPercentileSpec} from "@/utils/main/modify-percentile-spec";
import {applyServerValsPatch} from "@/utils/main/server-vals-patch";
import {CALCULATED_STATS} from "@/utils/shared/statcast";
import {DisplayType, type PercentileSpec} from "@/utils/shared/stats";

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
            feetAndInches: string[]       //    13 -> 1'1"
        ) {
            for (const stat of CALCULATED_STATS) {
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
                }[stat.property.display_type] ?? [];

                list.push(stat.property.value);
            }
        }
    };
});
