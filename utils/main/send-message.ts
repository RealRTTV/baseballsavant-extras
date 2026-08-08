import {CHANNEL_MARKER, isResponse, type Request} from "@/utils/shared/send-message.ts";

let nextId = 0;

export function sendMessage<T = unknown>(payload: object, timeout: number = 5_000): Promise<T> {
    const id = nextId++;

    return new Promise((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout>;

        const onMessage = (e: MessageEvent) => {
            if (e.source !== window || !isResponse(e.data) || e.data.id !== id) {
                return;
            }

            cleanup();

            if (e.data.err !== undefined) {
                reject(new Error(e.data.err));
            } else {
                resolve(e.data.payload as T);
            }
        }

        window.addEventListener('message', onMessage);

        const cleanup = () => {
            window.removeEventListener('message', onMessage);
            clearTimeout(timer);
        };

        timer = setTimeout(() => {
            cleanup();
            reject(new Error(`sendMessage timed out after ${timeout}ms: ${JSON.stringify(payload)}`));
        }, timeout);

        const request: Request = {
            __ext: 'request',
            marker: CHANNEL_MARKER,
            id,
            payload,
        }

        window.postMessage(request, window.location.origin);
    });
}
