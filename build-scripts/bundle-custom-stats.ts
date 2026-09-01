import {build, type Plugin} from 'vite';
import {readdir} from 'node:fs/promises';
import {join, relative, resolve} from 'node:path';

async function getCustomStatPaths() {
    const entries = await readdir("utils/shared/stats/custom_stats", { recursive: true, withFileTypes: true });
    const modulePaths = [];

    for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!entry.name.endsWith('.ts')) continue;
        if (entry.name === 'module.ts') continue;
        if (entry.name === 'index.ts') continue;
        modulePaths.push(join(entry.parentPath, entry.name));
    }

    return modulePaths;
}

async function bundleEntry(srcPath: string) {
    const outputFileName = relative("utils/shared/stats/custom_stats", srcPath).replace(/\.ts$/, '');

    await build({
        configFile: false,
        logLevel: 'warn',
        resolve: { alias: { "@": resolve('.') } },
        build: {
            outDir: resolve('./.output/custom_stats'),
            emptyOutDir: false,
            target: 'es2022',
            minify: false,
            lib: {
                entry: resolve(srcPath),
                formats: ['es'],
                fileName: outputFileName,
            }
        }
    })
}

export function bundleCustomStatsPlugin(): Plugin {
    return {
        name: 'bundle-custom-stats',
        apply: 'build',
        async closeBundle() {
            for (const path of await getCustomStatPaths()) {
                await bundleEntry(path);
            }
        },
    }
}