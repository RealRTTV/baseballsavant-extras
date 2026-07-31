import { defineConfig } from 'wxt';

export default defineConfig({
    manifest: {
        permissions: ['webRequest', 'webRequestBlocking', '*://baseballsavant.mlb.com/*', '*://builds.mlbstatic.com/*',],
    },
});
