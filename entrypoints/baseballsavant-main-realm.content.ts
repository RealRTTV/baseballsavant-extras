import {isResponseMixinCode} from "@/utils/messages/response-mixin-code.ts";

export default defineContentScript({
    matches: ['*://baseballsavant.mlb.com/savant-player/*'],
    world: 'MAIN',
    runAt: 'document_end',
    async main() {
        const response: Promise<string> = new Promise((resolve, reject) => {
            window.postMessage("baseballsavant-extras:request-src", "*");

            function handler(message: MessageEvent<any>) {
                if (isResponseMixinCode(message.data)) {
                    window.removeEventListener('message', handler);
                    resolve(message.data.src);
                }
            }

            window.addEventListener('message', handler);

            setTimeout(() => reject(new Error("Took too long to get a response (>5s)")), 5_000);
        });

        eval(await response);
    }
})