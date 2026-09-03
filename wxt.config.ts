import {defineConfig} from 'wxt';
import {bundleCustomStatsPlugin} from './build-scripts/bundle-custom-stats.ts';

export default defineConfig({
    manifestVersion: 3,
    vite: () => ({
        plugins: [bundleCustomStatsPlugin()],
    }),
    manifest: {
        content_security_policy: {
            extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
        },
        action: {},
        optional_permissions: [
            'userScripts',
        ],
        permissions: [
            'userScripts',
            'storage',
            'webRequest',
            'webRequestBlocking',
            '*://baseballsavant.mlb.com/*',
            '*://builds.mlbstatic.com/*',
            'unlimitedStorage'
        ],
    }
});
