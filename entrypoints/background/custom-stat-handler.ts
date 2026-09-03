import firstPitchStrikeURL from '@/custom-stats-rs/target/wasm32-unknown-unknown/debug/first_pitch_strike.wasm?url';

export type CustomStatHandler = {

}

export async function initCustomStatHandlers() {
    console.log('wasm handler init!');

    const imports = {
        env: {
            log: console.log,
        }
    }

    const firstPitchStrikeWasmBytes = await fetch(firstPitchStrikeURL).then(res => res.arrayBuffer());

    const { instance } = await WebAssembly.instantiate(firstPitchStrikeWasmBytes, imports);
    const result = instance.exports.add_and_log(1, 2);
    console.log('result:', result);
}
