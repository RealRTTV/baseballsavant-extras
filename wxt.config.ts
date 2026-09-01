import {defineConfig} from 'wxt';
import {bundleCustomStatsPlugin} from './build-scripts/bundle-custom-stats.ts';

export default defineConfig({
    vite: () => ({
        plugins: [bundleCustomStatsPlugin()],
    }),
    manifest: {
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
