use std::alloc::{alloc, Layout, dealloc};
use std::slice;
use shared::{log, warn};

const PERCENTILE_PROPERTY: &[u8] = include_bytes!("percentile_property.json");

#[unsafe(link_section = "percentile_property")]
pub static PERCENTILE_PROPERTY_STATIC: [u8; PERCENTILE_PROPERTY.len()] = {
    let mut out = [0; PERCENTILE_PROPERTY.len()];
    let mut i = 0;
    while i < PERCENTILE_PROPERTY.len() {
        out[i] = PERCENTILE_PROPERTY[i];
        i += 1;
    }
    out
};

#[unsafe(no_mangle)]
pub extern "C" fn malloc(size: usize, align: usize) -> *mut u8 {
    unsafe { alloc(Layout::from_size_align(size, align).unwrap()) }
}

#[unsafe(no_mangle)]
pub extern "C" fn free(ptr: *mut u8, size: usize, align: usize) {
    unsafe { dealloc(ptr, Layout::from_size_align(size, align).unwrap()) }
}

#[unsafe(no_mangle)]
pub extern "C" fn main(ptr: *mut u8, size: usize) {
    log("hi mom");
    let str = str::from_utf8(unsafe { slice::from_raw_parts(ptr, size) }).unwrap();
    warn(str);
}
