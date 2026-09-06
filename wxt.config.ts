import {defineConfig} from 'wxt';
import {bundleCustomStatsPlugin} from './build-scripts/bundle-custom-stats.ts';

export default defineConfig({
    vite: () => ({
        plugins: [bundleCustomStatsPlugin()],
    }),
    modules: ['@wxt-dev/auto-icons'],
    autoIcons: {
        baseIconPath: 'assets/icon.svg',
        developmentIndicator: false,
    },
    manifest: {
        content_security_policy: {
            extension_pages: "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' blob:; object-src 'self'"
        },
        browser_specific_settings: {
            gecko: {
                id: "baseballsavant-extras@rttv.ca"
            }
        },
        action: {},
        permissions: [
            'storage',
            'webRequest',
            'webRequestBlocking',
            '*://baseballsavant.mlb.com/*',
            '*://builds.mlbstatic.com/*',
            'unlimitedStorage'
        ],
    }
});
