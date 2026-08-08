import {modifyPercentileSpec} from "@/utils/main/modify-percentile-spec.ts";
import {modifyServerVals} from "@/utils/main/modify-server-vals.ts";

export default defineUnlistedScript(async () => {
    (globalThis as any).__savantExtras = {
        onPercentileSpec(percentileSpec: Record<string, any>) {
            try {
                modifyPercentileSpec(percentileSpec);
                modifyServerVals((globalThis as any).serverVals);
            } catch (e) {
                console.error(e);
            }
        }
    };
});
