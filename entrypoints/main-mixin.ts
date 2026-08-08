import {modifyPercentileSpec} from "@/utils/main/modify-percentile-spec.ts";
import {modifyServerVals} from "@/utils/main/modify-server-vals.ts";
import {FIRST_PITCH_STRIKE} from "@/utils/shared/custom_stats";

export default defineUnlistedScript(async () => {
    (globalThis as any).__savantExtras = {
        onPercentileSpec(percentileSpec: Record<string, any>) {
            try {
                modifyPercentileSpec(percentileSpec);
                modifyServerVals((globalThis as any).serverVals);
            } catch (e) {
                console.error(e);
            }
        },

        onStatDefinitions(statDefinitions: string[]) {
            statDefinitions.push(FIRST_PITCH_STRIKE.name);
            console.log(statDefinitions);
        }
    };
});
