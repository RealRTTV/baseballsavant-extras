import {requestMixinCode} from "@/utils/messages/request-mixin-code.ts";

export default defineContentScript({
    matches: ['*://baseballsavant.mlb.com/savant-player/*'],
    world: 'ISOLATED',
    runAt: 'document_end',
    main(ctx) {
        if (import.meta.env.FIREFOX) {
            return;
        }
        
        const allScripts = Array.from(document.body.querySelectorAll('script')).map(script => script.src);
        const bundleUrl = allScripts.find(href => href.startsWith('https://builds.mlbstatic.com/baseballsavant.mlb.com/v1/sections/player-update/builds/') && href.endsWith("/scripts/build/index.js"))!;

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