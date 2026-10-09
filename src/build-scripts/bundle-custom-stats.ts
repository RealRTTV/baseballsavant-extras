import {build, type Plugin} from 'vite';
import {readdir, copyFile} from 'node:fs/promises';
import {join, relative, resolve} from 'node:path';
import {execSync} from 'child_process';

async function getCustomStatPaths() {
    const entries = await readdir("src/utils/stats/custom_stats", { recursive: true, withFileTypes: true });
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
    const outputFileName = relative("src/utils/stats/custom_stats", srcPath).replace(/\.ts$/, '');

    await build({
        configFile: false,
        logLevel: 'warn',
        resolve: { alias: { "@": resolve('./src') } },
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
        enforce: 'pre',
        apply: 'build',
        async closeBundle() {
            execSync('cd src/rust-wasm && /bin/bash ./build.sh');

            for (const path of await getCustomStatPaths()) {
                await bundleEntry(path);
            }

            for (const file of await readdir("src/rust-wasm/pkg", { recursive: false, withFileTypes: true })) {
                const from = resolve(join(file.parentPath, file.name));
                const to = resolve(`./.output/custom_stats/${file.name}`);
                await copyFile(from, to);
            }
        }
    }
}
