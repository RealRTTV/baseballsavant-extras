import {getStatcastData} from "@/utils/extension/statcast.ts";

const PERCENTILE_RANKINGS_SPEC = /(?:^|[\s,;{(=])([A-Za-z_$][\w$]*)\s*=\s*\{\s*batterValue\s*:\s*\{\s*props\s*:/;

function patchPercentileRankingsSpec(src: string): string {
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

const STAT_DEFINITIONS = /([A-Za-z_$][\w$]*)\s*=\s*\[['"]hard_hit_percent['"]\s*,/;

function patchStatDefinitions(src: string): string {
    const match = src.match(STAT_DEFINITIONS);

    if (match === null || match[1] === undefined) {
        throw new Error(`anchor missed: STAT_DEFINITIONS=${!!STAT_DEFINITIONS} not found.`);
    }

    const varName = match[1];
    const line = new RegExp(`${varName}\s*=\s*\\[['"]hard_hit_percent['"],\s*[\\S\\s]*?\],\s*`);

    if (!line.test(src)) {
        throw new Error("second anchor missed.");
    }

    return src.replace(line, hit => { console.log(hit); return `${hit}__savantUnused=typeof __savantExtras!=="undefined"&&__savantExtras.onStatDefinitions(${varName}),` })
}

export default defineBackground(() => {
    indexBundleJsMixin();
    getStatcastData().then(_ => {});
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
                    let runtime: string | undefined = await fetch(browser.runtime.getURL('/main-mixin.js')).then(r => r.text());

                    if (!runtime) {
                        throw new Error('runtime not loaded');
                    }

                    out = patchPercentileRankingsSpec(out);
                    out = patchStatDefinitions(out);
                    out = runtime + '\n;' + out;
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
