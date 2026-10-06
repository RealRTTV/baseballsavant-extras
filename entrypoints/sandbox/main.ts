// offscreen -> sandbox
import {
    B2W_RESPONSE_MESSAGE_NAME,
    type B2WResponseMessage,
    isB2WRequestMessage,
    W2B_REQUEST_MESSAGE_NAME, type W2BRequestMessage, type W2BResponseMessage
} from "@/utils/messages/worker.ts";

async function sendW2BMessage(payload: W2BRequestMessage["payload"]): Promise<W2BResponseMessage> {
    const uuid = crypto.randomUUID();

    parent.postMessage({
        payload,
        message: W2B_REQUEST_MESSAGE_NAME,
        uuid,
    } satisfies W2BRequestMessage, "*");

    return new Promise((resolve, reject) => {
        function handler(event: MessageEvent<any>) {
            if (event.data.uuid === uuid) {
                window.removeEventListener('message', handler);
                resolve(event.data);
            }
        }

        window.addEventListener('message', handler);
        setTimeout(() => reject(new Error("Took too long (>5s)")), 5000);
    });
}

window.addEventListener('message', async event => {
    if (!isB2WRequestMessage(event.data)) {
        return;
    }

    if ('test' in event.data.payload) {
        console.log('message from background:', event.data.payload.test);
        // sandbox -> offscreen
        event.source!.postMessage({
            message: B2W_RESPONSE_MESSAGE_NAME,
            uuid: event.data.uuid,
            payload: { test: 'hi from the sandbox b2w' }
        } satisfies B2WResponseMessage, { targetOrigin: event.origin });

        let response = await sendW2BMessage({ test2: 'hi from the sandbox w2b; spawned by b2w test' });
        console.log('w2b response on sandbox realm:', response.payload.test2);
    }
});
