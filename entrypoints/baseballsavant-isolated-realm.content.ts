import {requestMixinCode} from "@/utils/messages/request-mixin-code.ts";

export default defineContentScript({
    matches: ['*://baseballsavant.mlb.com/savant-player/*'],
    world: 'ISOLATED',
    runAt: 'document_start',
    main(ctx) {
        const bundleUrl = "https://builds.mlbstatic.com/baseballsavant.mlb.com/v1/sections/player-update/builds/728cc30ffd5e8500395b60ab4225480405329885/scripts/build/index.js";

        // const url = new Promise(resolve => {
            ctx.addEventListener(window, 'error', event => {
                console.log(event);
            });
        // });

        (async () => {
            const response = requestMixinCode(window.location.href, bundleUrl);

            function handler(event: MessageEvent<any>): true | void {
                if (event.data === "baseballsavant-extras:request-src") {
                    window.removeEventListener('message', handler);
                    response.then(response => {
                        window.postMessage(response, "*");
                    });
                    return true;
                }
            }

            window.addEventListener('message', handler);
        })()
    }
})