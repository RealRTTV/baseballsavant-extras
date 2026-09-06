import testUrl from '@/.output/custom_stats/first_pitch_strike.wasm?url';

type WASMExports = {
    main: () => void;

    malloc(n: number): number;

    free(ptr: number, n: number): void;
}

export async function initWasm() {
    const imports = {
        env: {
            log: console.log,
        }
    };
    const { instance } = await WebAssembly.instantiateStreaming(fetch(testUrl), imports);
    const exports: WASMExports = instance.exports as WASMExports;

    exports.main();
}
