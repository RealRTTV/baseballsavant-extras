import {
    rerunStatcastDataCalculations,
    CURRENT_TASK_QUEUE_STATE
} from "@/entrypoints/background/statcast";
import {isRerunStatcastDataCalculations} from "@/utils/messages/rerun-statcast-data-calculations.ts";
import {initBundleMixin, mixinCodeForURL} from "@/entrypoints/background/savant-bundle-mixin.ts";
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
import {isRequestMixinCode} from "@/utils/messages/request-mixin-code.ts";
import {responseMixinCode} from "@/utils/messages/response-mixin-code.ts";

export default defineBackground(() => {
    (async () => {
        initMessageHandler();
        if (!import.meta.env.FIREFOX) await registerOffscreenWorker();
        await refreshCustomStats();
        await initConfig();
        initSidePanel();
        if (import.meta.env.FIREFOX) initBundleMixin();
        await rerunStatcastDataCalculations();
    })()
});

async function registerOffscreenWorker() {
    await browser.offscreen.createDocument({
        url: "/offscreen.html",
        reasons: ["IFRAME_SCRIPTING"],
        justification: "Needed to run custom stat calculations in-browser."
    });
}

function initMessageHandler() {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (isRerunStatcastDataCalculations(message)) {
            rerunStatcastDataCalculations().then(() => sendResponse());
            return true;
        } else if (isStatcastCalculationsState(message)) {
            sendResponse(CURRENT_TASK_QUEUE_STATE);
        } else if (isRequestRemoveCustomStatFile(message)) {
            removeCustomStatFile(message.filename).then(sendResponse);
            return true;
        } else if (isRequestAddCustomStat(message)) {
            addCustomStat(message.filename, message.contents).then(sendResponse);
            return true;
        } else if (isRequestLoadedCustomStatProperties(message)) {
            sendResponse(LOADED_CUSTOM_STAT_PROPERTIES);
        } else if (isRequestMixinCode(message)) {
            (async () => {
                return responseMixinCode(await mixinCodeForURL(message.url, message.bundleUrl));
            })().then(sendResponse);
            return true;
        } else if (isW2BRequestMessage(message)) {
            (async () => {
                const payload = await handleW2BMessage(message);
                if (payload !== undefined) {
                    return {
                        payload,
                        uuid: message.uuid,
                        message: W2B_RESPONSE_MESSAGE_NAME,
                    } satisfies W2BResponseMessage;
                }
            })().then(sendResponse);
            return true;
        }
    });
}

function initSidePanel() {
    if (import.meta.env.FIREFOX) {
        browser.browserAction.onClicked.addListener(() => {
            (browser as any).sidebarAction.toggle();
        })
    } else {
        browser.sidePanel.setPanelBehavior({openPanelOnActionClick: true}).catch(e => console.error("setPanelBehavior failed", e));
    }
}
