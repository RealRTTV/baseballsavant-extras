import {patchPercentileRankingsSpec} from "@/utils/patch-percentile-rankings-spec";

export default defineBackground(() => {
    let runtime = '';
    const ready = fetch(browser.runtime.getURL('/mixin-percentile-rankings-spec.js'))
        .then(r => r.text())
        .then(t => { runtime = t; });

    browser.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!/index\.bundle\.js/.test(details.url)) return {};

            const stream = browser.webRequest.filterResponseData(details.requestId);
            const decoder = new TextDecoder(), encoder = new TextEncoder();
            let out = '';

            stream.ondata = (data: any) => { out += decoder.decode(data.data, { stream: true }); };
            stream.onstop = async () => {
                out += decoder.decode();
                try {
                    await ready;

                    if (!runtime) {
                        throw new Error('runtime not loaded');
                    }
                    out = `${runtime}\n;${patchPercentileRankingsSpec(out)}`;
                    badge('');
                } catch (err) {
                    console.error('[baseballsavant-extras]', err);
                    badge('!');
                }
                stream.write(encoder.encode(out));
                stream.close();
            };

            return {};
        },
        { urls: ['*://builds.mlbstatic.com/baseballsavant.mlb.com/*'], types: ['script'] },
        ['blocking'],
    );
});

function badge(text: string) {
    browser.browserAction.setBadgeText({ text });
    if (text) browser.browserAction.setBadgeBackgroundColor({ color: '#c00' });
}
