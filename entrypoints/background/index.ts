import {rerunStatcastDataCalculations} from "@/entrypoints/background/statcast";
import {isRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {initBundleMixin} from "@/entrypoints/background/savant-bundle-mixin.ts";

export default defineBackground(() => {
    console.log(new Function("return 'hi mom'")());
    initMessageHandler();
    initSidePanel();
    initBundleMixin();
    rerunStatcastDataCalculations();
});

function initMessageHandler() {
    // rerunStatcastDataCalculations
    browser.runtime.onMessage.addListener(message => {
        if (isRerunStatcastDataCalculations(message)) {
            rerunStatcastDataCalculations();
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
