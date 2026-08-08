import {modifyPercentileSpec} from "@/utils/main/modify-percentile-spec.ts";
import {applyServerValsPatch} from "@/utils/main/server-vals-patch.ts";
import {STATS} from "@/utils/shared/statcast.ts";

export default defineUnlistedScript(async () => {
    (globalThis as any).__savantExtras = {
        onPercentileSpec(percentileSpec: Record<string, any>) {
            try {
                applyServerValsPatch((globalThis as any).serverVals, (globalThis as any).__savantServerValsPatch);
                modifyPercentileSpec(percentileSpec);
            } catch (e) {
                console.error(e);
            }
        },

        onStatDefinitions(statDefinitions: string[]) {
            statDefinitions.push(...STATS.map(stat => stat.name));
        }
    };
});
