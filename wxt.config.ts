import {defineConfig} from 'wxt';
import {bundleCustomStatsPlugin} from './src/build-scripts/bundle-custom-stats.ts';
import arraybuffer from 'vite-plugin-arraybuffer';

const CHROME_CSP: string = "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
const FIREFOX_CSP: string = "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' blob:; object-src 'self';"

export default defineConfig({
    vite: () => ({
        plugins: [bundleCustomStatsPlugin(), arraybuffer()],
        server: { cors: { origin: [/^chrome-extension:\/\//, "null"] } },
    }),
    srcDir: "src",
    modules: ['@wxt-dev/auto-icons'],
    autoIcons: {
        baseIconPath: 'assets/icon.svg',
        developmentIndicator: false,
    },
    manifest: ({ manifestVersion }) => ({
        content_security_policy: {
            extension_pages: manifestVersion == 2 ? FIREFOX_CSP : CHROME_CSP,
            sandbox: manifestVersion == 2 ? undefined : "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:; child-src 'self' blob:;"
        },
        browser_specific_settings: manifestVersion == 3 ? undefined : {
            gecko: {
                id: "baseballsavant-extras@rttv.ca",
                update_url: "https://rttv.ca/baseballsavant-extras/firefox-updates.json",
            }
        },
        declarative_net_request: manifestVersion == 2 ? undefined : {
            rule_resources: [{
                enabled: true,
                id: "baseballsavant-mixin-block",
                path: "baseballsavant-mixin-block.json"
            }]
        },
        browser_action: {},
        permissions: [
            'storage',
            'unlimitedStorage',

            ...[
                'offscreen',
                'declarativeNetRequest',
                'declarativeNetRequestFeedback',
            ].filter(_ => manifestVersion == 3),

            ...[
                'webRequest',
                'webRequestBlocking',
                'webRequestFilterResponse',
            ].filter(_ => manifestVersion == 2),
        ],
        host_permissions: [
            '*://baseballsavant.mlb.com/*',
            '*://rttv.ca/statcast-subsidiary-csv/*',
            '*://builds.mlbstatic.com/*'
        ]
    })
});
