import {CHANNEL_MARKER, isRequest, type Response} from "@/utils/shared/send-message.ts";

export default defineContentScript({
    matches: ['*://baseballsavant.mlb.com/savant-player/*'],
    runAt: 'document_start',
    world: 'ISOLATED',
    main() {
        window.addEventListener('message', (e: MessageEvent<any>) => {
            console.log('received request', e.data);
            if (e.source !== window || !isRequest(e.data)) {
                return;
            }

            browser.runtime.sendMessage(e.data.payload)
                .then(res => {
                    const response: Response = {
                        __ext: "response",
                        id: e.data.id,
                        marker: CHANNEL_MARKER,
                        payload: res,
                    };
                    window.postMessage(response);
                })
                .catch(err => {
                    const response: Response = {
                        __ext: "response",
                        id: e.data.id,
                        marker: CHANNEL_MARKER,
                        payload: {},
                        err: String(err),
                    };
                    window.postMessage(response);
                });
        });
    }
})