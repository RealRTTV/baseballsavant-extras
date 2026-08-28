import {rerunStatcastDataCalculations} from "@/utils/extension/statcast";
import type {ServerValsPatch} from "@/utils/shared/server-vals-patch";
import {createServerValsPatch} from "@/utils/extension/server-vals-patch";
import {getConfig} from "@/utils/extension/config.ts";
import {rerunStatcastDataCalculationsHandler} from "@/utils/shared/messages/rerun-statcast-data-calculations.ts";

const MUST_CONTAIN: string[] = ['hard_hit_percent', 'batterValue'];

function isCorrectJSFile(contents: string): boolean {
    for (const contain of MUST_CONTAIN) {
        if (!contents.includes(contain)) {
            return false;
        }
    }

    return true;
}

const PERCENTILE_RANKINGS_SPEC = /(?:^|[\s,;{(=])([A-Za-z_$][\w$]*)\s*=\s*\{\s*batterValue\s*:\s*\{\s*props\s*:/;

function patchPercentileRankingsSpec(src: string): string {
    const match = src.match(PERCENTILE_RANKINGS_SPEC);

    if (match === null || match[1] === undefined) {
        throw new Error(`anchor missed: PERCENTILE_RANKINGS_SPEC=${PERCENTILE_RANKINGS_SPEC} not found.`);
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

    const REGEX_FOR_ANCHOR = (firstEntry: string) => new RegExp(`([A-Za-z_$][\\w$]*)\\s*=\\s*\\[?['"\`]${firstEntry}\\s*['"\`\.],?`);

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

    const replacement = /,(\w+)\s*=\s*{\s*placeholder:\s*['"`]--['"`]/;

    if (!replacement.test(src)) {
        throw new Error(`stat formatting anchor missed`);
    }

    return src.replace(replacement, hit => `,__savantUnused=typeof __savantExtras!=="undefined"&&__savantExtras.onStatFormatting(${matches.map(match => match.match).join(',')},${JSON.stringify(getConfig().activeStats)})${hit}`)
}

export default defineBackground(() => {
    jsBundleMixin();
    initMessageHandler();
    rerunStatcastDataCalculations();
});

function initMessageHandler() {
    browser.runtime.onMessage.addListener(rerunStatcastDataCalculationsHandler);
}

function jsBundleMixin() {
    const PLAYER_ID_REGEX: RegExp = /savant-player\/[\w-]+?-(\d+)/;

    browser.webRequest.onBeforeRequest.addListener(
        (details) => {
            const url = (details as any).originUrl as string;
            if (url !== undefined && !url.includes('://baseballsavant.mlb.com/savant-player/')) {
                return {};
            }

            if (!details.url.includes('.js')) return {};

            const stream = (browser.webRequest as any).filterResponseData(details.requestId);
            const decoder = new TextDecoder('utf-8');
            let out = '';

            stream.ondata = (data: any) => { out += decoder.decode(data.data, { stream: true }); };
            stream.onstop = async () => {
                out += decoder.decode();
                try {
                    if (isCorrectJSFile(out)) {
                        let mixinCode: string | undefined = await fetch(browser.runtime.getURL('/main-mixin.js')).then(r => r.text());

                        if (!mixinCode) {
                            throw new Error('mixinCode not loaded');
                        }

                        const playerId: number = Number(((details as any).originUrl as string | undefined)?.match(PLAYER_ID_REGEX)?.[1]);
                        const patch: ServerValsPatch = await createServerValsPatch(playerId);

                        out = patchPercentileRankingsSpec(out);
                        console.log('Applied Percentile Rankings Patch Successfully!');
                        out = patchStatFormatting(out);
                        console.log('Applied Stat Formatting Patch Successfully!');
                        out = `globalThis.__savantServerValsPatch=${JSON.stringify(patch)};` + `globalThis.__savantNewPercentileSpec=${JSON.stringify(getConfig().percentiles)};` + '\n;' + mixinCode + '\n;' + out;
                        badge('');
                    }
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
    if (text.length > 0) browser.browserAction.setBadgeBackgroundColor({ color: '#c00' });
}
