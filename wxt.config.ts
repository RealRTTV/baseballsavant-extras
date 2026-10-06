import {defineConfig} from 'wxt';
import {bundleCustomStatsPlugin} from './build-scripts/bundle-custom-stats.ts';
import arraybuffer from 'vite-plugin-arraybuffer';

const CHROME_CSP: string = "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
const FIREFOX_CSP: string = "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' blob:; object-src 'self';"

export default defineConfig({
    vite: () => ({
        plugins: [bundleCustomStatsPlugin(), arraybuffer()],
        server: { cors: { origin: [/^chrome-extension:\/\//, "null"] } },
    }),
    modules: ['@wxt-dev/auto-icons'],
    autoIcons: {
        baseIconPath: 'assets/icon.svg',
        developmentIndicator: false,
    },
    manifest: ({ manifestVersion }) => ({
        content_security_policy: {
            extension_pages: manifestVersion == 2 ? FIREFOX_CSP : CHROME_CSP,
            sandbox: "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:; child-src 'self' blob:;"
        },
        browser_specific_settings: {
            gecko: {
                id: "baseballsavant-extras@rttv.ca"
            }
        },
        action: {},
        declarative_net_request: {
            rule_resources: [{
                enabled: true,
                id: "baseballsavant-mixin-block",
                path: "baseballsavant-mixin-block.json"
            }]
        },
        permissions: [
            'storage',
            'unlimitedStorage',

            // 'webRequest',
            // 'webRequestBlocking',
            // "webRequestFilterResponse",

            "offscreen",
            "declarativeNetRequest",
            "declarativeNetRequestFeedback"
        ],
        host_permissions: [
            '*://baseballsavant.mlb.com/*',
            '*://rttv.ca/statcast-subsidiary-csv/*',
            '*://rttv.ca/statcast-subsidiary-version',
            '*://builds.mlbstatic.com/*'
        ]
    })
});
