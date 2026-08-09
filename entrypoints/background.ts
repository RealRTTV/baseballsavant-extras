import {getStatcastData} from "@/utils/extension/statcast.ts";
import type {ServerValsPatch} from "@/utils/shared/server-vals-patch.ts";
import {createServerValsPatch} from "@/utils/extension/server-vals-patch.ts";

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

function patchStatFormatting(src: string): string {
    const ANCHORS = [
        { name: "threeDPNoInt", firstEntry: "ba" },
        { name: "threeDP", firstEntry: "delta_pitcher_run_exp" },
        { name: "twoDP", firstEntry: "catcher_exchange" },
        { name: "oneDP", firstEntry: "hard_hit_percent" },
        { name: "zeroDP", firstEntry: "barrel" },
        { name: "withPercentOneDP", firstEntry: "rate_att_xb" },
        { name: "withPercentZeroDP", firstEntry: "rate_sbx" },
        { name: "degrees", firstEntry: "bat_path_angle" },
        { name: "feetAndInches", firstEntry: "height_in_inches" },
    ];

    const REGEX_FOR_ANCHOR = (firstEntry: string) => new RegExp(`([A-Za-z_$][\\w$]*)\\s*=\\s*\\[['"]${firstEntry}\\s*['"],?`);

    let anchors = ANCHORS.map(({ name, firstEntry }) => ({ name, firstEntry, regex: REGEX_FOR_ANCHOR(firstEntry) }));

    let matches = anchors.map(anchor => ({ match: src.match(anchor.regex)?.[1], ...anchor }));

    for (const match of matches) {
        let errorMessage = '';
        if (match.match === undefined) {
            errorMessage += `anchor missed: ${match.name}=${match.regex} not found.\n`;
        }
        if (errorMessage.length > 0) {
            throw new Error(errorMessage.slice(0, -1));
        }
    }

    const replacement = /,(\w+)\s*=\s*{\s*placeholder:\s*['"]--['"]/;

    if (!replacement.test(src)) {
        throw new Error(`stat formatting anchor missed`);
    }

    return src.replace(replacement, hit => `,__savantUnused=typeof __savantExtras!=="undefined"&&__savantExtras.onStatFormatting(${matches.map(match => match.match).join(',')})${hit}`)
}

export default defineBackground(() => {
    indexBundleJsMixin();
    getStatcastData().then(_ => {});
});

const PLAYER_ID_REGEX: RegExp = /savant-player\/[\w-]+?-(\d+)/;

function indexBundleJsMixin() {
    browser.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (!details.url.includes('index.bundle.js')) return {};

            const stream = (browser.webRequest as any).filterResponseData(details.requestId);
            const decoder = new TextDecoder('utf-8');
            let out = '';

            stream.ondata = (data: any) => { out += decoder.decode(data.data, { stream: true }); };
            stream.onstop = async () => {
                out += decoder.decode();
                try {
                    let mixinCode: string | undefined = await fetch(browser.runtime.getURL('/main-mixin.js')).then(r => r.text());

                    if (!mixinCode) {
                        throw new Error('mixinCode not loaded');
                    }

                    const playerId: number = Number(((details as any).originUrl as string | undefined)?.match(PLAYER_ID_REGEX)?.[1]);
                    const patch: ServerValsPatch = await createServerValsPatch(playerId);

                    out = patchPercentileRankingsSpec(out);
                    out = patchStatFormatting(out);
                    out = `globalThis.__savantServerValsPatch=${JSON.stringify(patch)};` + '\n;' + mixinCode + '\n;' + out;
                    badge('');
                } catch (err) {
                    console.error('[baseballsavant-extras]', err);
                    badge('!');
                } finally {
                    stream.write(new TextEncoder().encode(out));
                    stream.close();
                }
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
