import {isResponseMixinCode} from "@/utils/messages/response-mixin-code.ts";

export default defineContentScript({
    matches: ['*://baseballsavant.mlb.com/savant-player/*'],
    world: 'MAIN',
    runAt: 'document_idle',
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

            setTimeout(() => reject(new Error("Took too long to get a baseballsavant-extras response (>3s)")), 3_000);
        });

        try {
            eval(await response);
        } catch (error) {
            console.error(error);
            const headerErrorMessage = document.createElement("div");
            headerErrorMessage.style.display = "block";
            headerErrorMessage.style.backgroundColor = "#c0392b";
            headerErrorMessage.style.color = "black";
            headerErrorMessage.innerHTML = `
                <p>Baseball Savant Extras failed to load.</p>
                <p>If a reload doesn't fix this and it continues to happen, please disable the extension and report a bug to the <a href="https://github.com/RealRTTV/baseballsavant-extras" target="_blank" style="color: #0057ff">GitHub page</a>.</p>
            `;
            document.body.prepend(headerErrorMessage);
        }
    }
})