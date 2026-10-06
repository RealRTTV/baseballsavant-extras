import {
    rerunStatcastDataCalculations,
    CURRENT_TASK_QUEUE_STATE
} from "@/entrypoints/background/statcast";
import {isRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {initBundleMixin} from "@/entrypoints/background/savant-bundle-mixin.ts";
import {addCustomStat, refreshCustomStats} from "@/entrypoints/background/custom-stats.ts";
import {initConfig} from "@/utils/config.ts";
import {isStatcastCalculationsState} from "@/utils/messages/statcast-calculations-state.ts";
import {handleW2BMessage} from "@/entrypoints/background/worker.ts";
import {
    isW2BRequestMessage, W2B_RESPONSE_MESSAGE_NAME,
    type W2BResponseMessage
} from "@/utils/messages/worker.ts";
import {isRequestRemoveCustomStatFile} from "@/utils/messages/remove-custom-stat-file.ts";
import {removeCustomStatFile} from "@/entrypoints/background/custom-stats.ts";
import {isRequestAddCustomStat} from "@/utils/messages/add-custom-stat.ts";
import {isRequestLoadedCustomStatProperties} from "@/utils/messages/request-loaded-custom-stat-properties.ts";
import {LOADED_CUSTOM_STAT_PROPERTIES} from "@/utils/custom-stats.ts";

export default defineBackground(() => {
    (async () => {
        initMessageHandler();
        registerOffscreenWorker();
        await refreshCustomStats();
        await initConfig();
        initSidePanel();
        initBundleMixin();
        rerunStatcastDataCalculations();
    })()
});

function registerOffscreenWorker() {
    browser.runtime.onInstalled.addListener(async () => {
        await browser.offscreen.createDocument({
            url: "/offscreen.html",
            reasons: ["IFRAME_SCRIPTING"],
            justification: "Needed to run custom stat calculations in-browser."
        });
    })
}

function initMessageHandler() {
    browser.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
        if (isRerunStatcastDataCalculations(message)) {
            rerunStatcastDataCalculations();
        } else if (isStatcastCalculationsState(message)) {
            return CURRENT_TASK_QUEUE_STATE;
        } else if (isRequestRemoveCustomStatFile(message)) {
            return await removeCustomStatFile(message.filename);
        } else if (isRequestAddCustomStat(message)) {
            return await addCustomStat(message.filename, message.contents);
        } else if (isRequestLoadedCustomStatProperties(message)) {
            return LOADED_CUSTOM_STAT_PROPERTIES;
        } else if (isW2BRequestMessage(message)) {
            const payload = await handleW2BMessage(message);
            if (payload !== undefined) {
                sendResponse({
                    payload,
                    uuid: message.uuid,
                    message: W2B_RESPONSE_MESSAGE_NAME,
                } satisfies W2BResponseMessage);
            }
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
