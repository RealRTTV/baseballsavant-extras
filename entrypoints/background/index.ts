import {
    rerunStatcastDataCalculations,
    CURRENT_TASK_QUEUE_STATE
} from "@/entrypoints/background/statcast";
import {isRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {initBundleMixin} from "@/entrypoints/background/savant-bundle-mixin.ts";
import {isRefreshCustomStats} from "@/utils/messages/refresh-custom-stats.ts";
import {refreshCustomStats} from "@/utils/custom-stats.ts";
import {initConfig} from "@/utils/config.ts";
import {isStatcastCalculationsState} from "@/utils/messages/statcast-calculations-state.ts";

export default defineBackground({
    main() {
        (async () => {
            initMessageHandler();
            await refreshCustomStats();
            await initConfig();
            initSidePanel();
            initBundleMixin();
            rerunStatcastDataCalculations();
        })()
    }
});

function initMessageHandler() {
    browser.runtime.onMessage.addListener(async message => {
        if (isRerunStatcastDataCalculations(message)) {
            rerunStatcastDataCalculations();
        } else if (isRefreshCustomStats(message)) {
            await refreshCustomStats();
        } else if (isStatcastCalculationsState(message)) {
            return CURRENT_TASK_QUEUE_STATE;
        }
    });
}

function initSidePanel() {
    if (import.meta.env.FIREFOX) {
        (browser.browserAction ?? browser.action).onClicked.addListener(() => {
            (browser as any).sidebarAction.toggle();
        })
    } else {
        browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(e => console.error("setPanelBehavior failed", e));
    }
}
