import {patchPercentileRankingsSpec} from "@/utils/patch-percentile-rankings-spec";
import {statcastCustomStats} from "@/utils/statcast_fetch.ts";

export default defineBackground(() => {
    indexBundleJsMixin();
    statcastCustomStats().then(_ => {});
});

function indexBundleJsMixin() {
    browser.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!details.url.includes('index.bundle.js')) return {};

            const stream = browser.webRequest.filterResponseData(details.requestId);
            const decoder = new TextDecoder('utf-8');
            let out = '';

            stream.ondata = (data: any) => { out += decoder.decode(data.data, { stream: true }); };
            stream.onstop = async () => {
                out += decoder.decode();
                try {
                    let runtime: string | undefined = await fetch(browser.runtime.getURL('/mixin-percentile-rankings-spec.js')).then(r => r.text());

                    if (!runtime) {
                        throw new Error('runtime not loaded');
                    }

                    out = `${runtime}\n;${patchPercentileRankingsSpec(out)}`;
                    badge('');
                } catch (err) {
                    console.error('[baseballsavant-extras]', err);
                    badge('!');
                }
                stream.write(new TextEncoder().encode(out));
                stream.close();
            };

            return {};
        },
        { urls: ['*://builds.mlbstatic.com/baseballsavant.mlb.com/*'], types: ['script'] },
        ['blocking'],
    );
}

function badge(text: string) {
    browser.browserAction.setBadgeText({ text });
    if (text) browser.browserAction.setBadgeBackgroundColor({ color: '#c00' });
}
