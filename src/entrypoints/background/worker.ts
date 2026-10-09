import {
    B2W_REQUEST_MESSAGE_NAME,
    type B2WRequestMessage, type B2WResponseMessage,
    type W2BRequestMessage,
    type W2BResponseMessage
} from "@/utils/messages/worker.ts";

export async function sendB2WMessage(payload: B2WRequestMessage["payload"]): Promise<B2WResponseMessage> {
    const response: B2WResponseMessage = await browser.runtime.sendMessage({
        payload,
        uuid: crypto.randomUUID(),
        message: B2W_REQUEST_MESSAGE_NAME,
    } satisfies B2WRequestMessage);
    if ('error' in response.payload) {
        throw new Error(response.payload.error);
    } else {
        return response;
    }
}

export async function handleW2BMessage(_message: W2BRequestMessage): Promise<W2BResponseMessage["payload"] | undefined> {
    // nothing yet
    return undefined;
}
