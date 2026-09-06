#[link(wasm_import_module = "env")]
unsafe extern "C" {
    #[link_name = "log"]
    safe fn __log(ptr: *const u8, len: usize);

    #[link_name = "warn"]
    safe fn __warn(ptr: *const u8, len: usize);

    #[link_name = "error"]
    safe fn __error(ptr: *const u8, len: usize);
}

pub fn log(s: &str) {
    __log(s.as_ptr(), s.len());
}

pub fn warn(s: &str) {
    __warn(s.as_ptr(), s.len());
}

pub fn error(s: &str) {
    __error(s.as_ptr(), s.len());
}
