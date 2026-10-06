import {createDB} from "@/entrypoints/background/statcast.ts";
import {getDayBytesFromDB, getDaySubsidiaryBytesFromDB} from "@/entrypoints/background/statcast-helper.ts";
import {
    B2W_REQUEST_MESSAGE_NAME,
    type B2WRequestMessage, type B2WResponseMessage,
    type W2BRequestMessage,
    type W2BResponseMessage
} from "@/utils/messages/worker.ts";

export async function sendB2WMessage(payload: B2WRequestMessage["payload"]): Promise<B2WResponseMessage> {
    return await browser.runtime.sendMessage({
        payload: payload,
        uuid: crypto.randomUUID(),
        message: B2W_REQUEST_MESSAGE_NAME,
    } satisfies B2WRequestMessage);
}

export async function handleW2BMessage(message: W2BRequestMessage): Promise<W2BResponseMessage["payload"] | undefined> {
    if ('requestedBytesForDate' in message.payload) {
        const date = message.payload.requestedBytesForDate;
        const db = await createDB();
        return { requestedBytesForDate: await getDayBytesFromDB(date, db) };
    } else if ('requestedSubsidiaryBytesForDate' in message.payload) {
        const date = message.payload.requestedSubsidiaryBytesForDate;
        const db = await createDB();
        return { requestedSubsidiaryBytesForDate: await getDaySubsidiaryBytesFromDB(date, db) };
    } else if ('test2' in message.payload) {
        console.log('got msg from worker:', message.payload.test2);
        return { test2: 'hi from the background w2b' };
    } else {
        console.error(`Unknown W2B request: ${message}`);
    }
}
