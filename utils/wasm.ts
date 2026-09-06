export type WASMExports = {
    memory: WebAssembly.Memory,

    main: () => void;
} & Record<string, object>;
