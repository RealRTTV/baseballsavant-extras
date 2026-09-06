use std::alloc::{alloc, dealloc, Layout};

#[link(wasm_import_module = "env")]
unsafe extern "C" {
    safe fn log(_: i32);
}

#[unsafe(no_mangle)]
pub extern "C" fn malloc(len: usize) -> *mut u8 {
    unsafe { alloc(Layout::array::<u8>(len).expect("valid layout")) }
}

#[unsafe(no_mangle)]
pub extern "C" fn free(ptr: *mut u8, len: usize) {
    unsafe { dealloc(ptr, Layout::array::<u8>(len).unwrap()) }
}

#[unsafe(no_mangle)]
pub extern "C" fn main() {
    log(4);
}
