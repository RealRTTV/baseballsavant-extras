import {
    isB2WRequestMessage,
    isW2BRequestMessage,
    isW2BResponseMessage,
    type W2BResponseMessage
} from "@/utils/messages/worker.ts";

const sandbox = document.querySelector('iframe')?.contentWindow!;

// background -> offscreen
browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (isB2WRequestMessage(msg)) {
        const uuid: string = msg.uuid!;

        function handleMessage(event: MessageEvent<any>) {
            if (event.data.uuid === uuid) {
                window.removeEventListener('message', handleMessage);
                // offscreen -> background
                sendResponse(event.data);
            }
        }

        // sandbox -> offscreen
        window.addEventListener('message', handleMessage);
        // offscreen -> sandbox
        sandbox.postMessage(msg, "*");
        return true;
    } else if (isW2BResponseMessage(msg)) {
        sandbox.postMessage(msg, "*");
    }
});

// sandbox -> offscreen
window.addEventListener('message', async event => {
    if (isW2BRequestMessage(event.data)) {
        // offscreen -> background & background -> offscreen
        const response: W2BResponseMessage = await browser.runtime.sendMessage(event.data);
        // offscreen -> sandbox
        sandbox.postMessage(response, "*");
    }
});
