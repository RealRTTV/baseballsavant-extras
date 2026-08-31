import {defineConfig} from 'wxt';

export default defineConfig({
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
