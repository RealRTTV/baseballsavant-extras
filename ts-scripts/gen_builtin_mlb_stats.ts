import * as STATS from "../utils/stats/index.ts";
import { isPercentileProperty } from "../utils/stats/index.ts";

const props = Object.values(STATS).filter(isPercentileProperty);
console.log("Name | `internal_name` | Description");
console.log("-----|-----------------|------------");
for (const prop of props) {
    console.log(`${prop.label} | \`${prop.value}\` | ${(prop as any).description ?? ''}`);
}
