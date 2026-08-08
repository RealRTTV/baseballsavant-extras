import {statcastCustomStats} from "@/utils/extension/statcast.ts";

const PERCENTILE_RANKINGS_SPEC = /(?:^|[\s,;{(=])([A-Za-z_$][\w$]*)\s*=\s*\{\s*batterValue\s*:\s*\{\s*props\s*:/;

export function patchPercentileRankingsSpec(src: string): string {
    const match = src.match(PERCENTILE_RANKINGS_SPEC);

    if (match === null || match[1] === undefined) {
        throw new Error(`anchor missed: PERCENTILE_RANKINGS_SPEC=${!!PERCENTILE_RANKINGS_SPEC} not found.`);
    }

    const varName = match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const line = new RegExp(`Object\\.keys\\(${varName}\\)\\.forEach\\(`);

    if (!line.test(src)) {
        throw new Error("second anchor missed.");
    }

    return src.replace(line, hit => `typeof __savantExtras!=="undefined"&&__savantExtras.onPercentileSpec(${varName}),${hit}`)
}

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
                    let runtime: string | undefined = await fetch(browser.runtime.getURL('/mixin.js')).then(r => r.text());

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
