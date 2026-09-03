import {rerunStatcastDataCalculations} from "@/entrypoints/background/statcast";
import {isRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {initBundleMixin} from "@/entrypoints/background/savant-bundle-mixin.ts";
import {isRefreshCustomStats} from "@/utils/messages/refresh-custom-stats.ts";
import {refreshCustomStats} from "@/utils/custom-stats.ts";

export default defineBackground(() => {
    initMessageHandler();
    initSidePanel();
    initBundleMixin();
    rerunStatcastDataCalculations();
});

function initMessageHandler() {
    browser.runtime.onMessage.addListener(async message => {
        if (isRerunStatcastDataCalculations(message)) {
            rerunStatcastDataCalculations();
        } else if (isRefreshCustomStats(message)) {
            await refreshCustomStats();
        }
    });
}

function initSidePanel() {
    if (import.meta.env.FIREFOX) {
        (browser.browserAction ?? browser.action).onClicked.addListener(() => {
            (browser as any).sidebarAction.toggle();
        })
    } else {
        browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(e => console.error("setPanelBehavior failed", e));
    }
}
