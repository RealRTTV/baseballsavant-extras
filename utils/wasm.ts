export type WASMExports = {
    memory: WebAssembly.Memory,

    malloc: (size: number, align: number) => number;
    free: (ptr: number, size: number, align: number) => number;

    _start: () => void;

    /**
     * @param {number} ptr - to the JSON-serialized representation of the cache.
     * @param {number} len - length of ptr in bytes
     *
     * strings should be UTF-8 encoded.
     * {@code ptr} or {@code len} will be {@code 0} iff there is no cache, use this state to initialize a default cache
     *
     * Note: all caches must have:
     * 1. A {@code .cached_dates} field of type {@code string[]} with {@code YYYY-MM-DD} date format.
     * 2. A {@code .by_player} field of type {@code Record<string, string>}, these values must be double-encoded within the serialized JSON.
     * 3. Optionally, A {@code .qualification_threshold} that sets the qualification threshold number of samples.
     */
    deserialize_cache: (ptr: number, len: number) => boolean | number;

    /**
     * View {@code deserialize_cache}'s docs on a valid cache format.
     *
     * This function returns a 64-bit number with a ptr in the lower 32-bits and a len in the upper 32 bits.
     */
    serialize_cache: () => number;

    on_incremental: () => void;

    /**
     * @param {[number, number]} ptr+len - string slice of a CSV allocated by JS in the WASM Module's memory.
     *
     * Modifies the cache stored in static memory.
     */
    apply: (ptr: number, len: number) => void;

    /**
     * Returns whether to re-run the apply passes.
     */
    on_finish_apply: () => boolean | number;

    value: (ptr: number, len: number) => number;

    samples: (ptr: number, len: number) => number;
} & Record<string, any>;
