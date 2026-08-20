import {defineConfig} from 'wxt';

export default defineConfig({
    manifest: {
        permissions: [
            'sidePanel',
            'webRequest',
            'webRequestBlocking',
            '*://baseballsavant.mlb.com/*',
            '*://builds.mlbstatic.com/*',
            'unlimitedStorage'
        ],
    }
});
