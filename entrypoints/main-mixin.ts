import {modifyPercentileSpec, type PercentileSpec} from "@/utils/main/modify-percentile-spec.ts";
import {applyServerValsPatch} from "@/utils/main/server-vals-patch.ts";
import {STATS} from "@/utils/shared/statcast.ts";

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
            oneDP.push(...STATS.map(stat => stat.name));
        }
    };
});
