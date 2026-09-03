pub mod console {
    #[link(wasm_import_module = "env")]
    unsafe extern "C" {
        pub safe fn log(value: i32);
    }
}