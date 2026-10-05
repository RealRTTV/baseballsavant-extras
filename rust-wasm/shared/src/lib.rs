pub fn set_panic_hook() {
    std::panic::set_hook(Box::new(|info| {
        let mut msg = info.to_string();

        msg.push_str("\n\nStack:\n\n");
        // let e = Error::new();
        // let stack = e.stack();
        // msg.push_str(&stack);
        // msg.push_str("\n\n");

        error(&msg);
    }));
}

/// Helpful macro for exporting the correct FFI functions with handy wrappers for (ptr, len) signatures, etc.
///
/// It is recommended to use a `static` reference to the cache such to be accessed in deserialize_cache and serialize_cache
///
/// ## Examples
///
/// ### Stub
/// ```no_run
/// use shared::export_ffi;
///
/// export_ffi! {
///     fn deserialize_cache(csv: &str) {  }
///     fn serialize_cache() -> String { String::new() }
///     fn on_incremental() {}
///     fn apply(csv: &str) {}
///     fn on_finish_apply() -> bool { false }
///     fn value(json: &str) -> f64 { 0.0 }
///     fn samples(json: &str) -> usize { 0 }
/// }
/// ```
#[macro_export]
macro_rules! export_ffi {
    (
        fn deserialize_cache($cache_json:ident: &$(mut)? str) $deserialize_cache:block
        fn serialize_cache() -> String $serialize_cache:block
        fn on_incremental() $on_incremental:block
        fn apply($apply_csv:ident: &$(mut)? str, $apply_subs_csv:ident: &$(mut)? str) $apply:block
        fn on_finish_apply() -> bool $on_finish_apply:block
        fn value($value_json:ident: &$(mut)? str) -> f64 $value:block
        fn samples($samples_json:ident: &$(mut)? str) -> usize $samples:block
    ) => {
        export_ffi! {
            fn malloc(size: usize, align: usize) -> *mut u8 {
                unsafe { ::std::alloc::alloc(::std::alloc::Layout::from_size_align(size, align).unwrap()) }
            }

            fn free(ptr: *mut u8, size: usize, align: usize) {
                unsafe { ::std::alloc::dealloc(ptr, ::std::alloc::Layout::from_size_align(size, align).unwrap()) }
            }

            fn _start() {
                $crate::set_panic_hook();
            }

            fn deserialize_cache($cache_json: &mut str) $deserialize_cache
            fn serialize_cache() -> String $serialize_cache
            fn on_incremental() $on_incremental
            fn apply($apply_csv: &mut str, $apply_subs_csv: &mut str) $apply
            fn on_finish_apply() -> bool $on_finish_apply
            fn value($value_json: &mut str) -> f64 $value
            fn samples($samples_json: &mut str) -> usize $samples
        }
    };
    (
        fn malloc($malloc_size:ident: usize, $malloc_align:ident: usize) -> *mut u8 $malloc:block
        fn free($free_ptr:ident: *mut u8, $free_size:ident: usize, $free_align:ident: usize) $free:block
        fn _start() $_start:block
        fn deserialize_cache($cache_json:ident: &$(mut)? str) $deserialize_cache:block
        fn serialize_cache() -> String $serialize_cache:block
        fn on_incremental() $on_incremental:block
        fn apply($apply_csv:ident: &$(mut)? str, $apply_subs_csv:ident: &$(mut)? str) $apply:block
        fn on_finish_apply() -> bool $on_finish_apply:block
        fn value($value_json:ident: &$(mut)? str) -> f64 $value:block
        fn samples($samples_json:ident: &$(mut)? str) -> usize $samples:block
    ) => {
        #[doc(hidden)]
        #[unsafe(export_name = "malloc")]
        pub extern "C" fn __malloc($malloc_size: usize, $malloc_align: usize) -> *mut u8 $malloc

        #[doc(hidden)]
        #[unsafe(export_name = "free")]
        pub extern "C" fn __free($free_ptr: *mut u8, $free_size: usize, $free_align: usize) $free

        #[doc(hidden)]
        #[unsafe(export_name = "_start")]
        pub extern "C" fn __start() $_start

        #[doc(hidden)]
        #[unsafe(export_name = "deserialize_cache")]
        pub extern "C" fn __deserialize_cache(ptr: *mut u8, size: usize) {
            // SAFETY: FFI boundary, TextEncoder() encodes UTF-8
            let $cache_json = unsafe { ::core::str::from_utf8_unchecked_mut(unsafe { ::core::slice::from_raw_parts_mut(ptr, size) }) };
            $deserialize_cache
        }

        #[doc(hidden)]
        #[unsafe(export_name = "serialize_cache")]
        pub extern "C" fn __serialize_cache() -> i64 {
            #[doc(hidden)]
            fn __serialize_cache0() -> String $serialize_cache

            let string: &str = Box::leak(__serialize_cache0().into_boxed_str());
            let ptr = string.as_ptr() as usize as u64;
            let len = string.len() as u64;
            let encoded = ptr | (len << 32);
            encoded as i64
        }

        #[doc(hidden)]
        #[unsafe(export_name = "on_incremental")]
        pub extern "C" fn __on_incremental() $on_incremental

        #[doc(hidden)]
        #[unsafe(export_name = "apply")]
        pub extern "C" fn __apply(ptr: *mut u8, size: usize, sub_ptr: *mut u8, sub_size: usize) {
            // SAFETY: FFI boundary, TextEncoder() encodes UTF-8
            let $apply_csv = unsafe { ::core::str::from_utf8_unchecked(::core::slice::from_raw_parts(ptr, size)) };
            // SAFETY: FFI boundary, TextEncoder() encodes UTF-8
            let $apply_subs_csv = unsafe { ::core::str::from_utf8_unchecked(::core::slice::from_raw_parts(sub_ptr, sub_size)) };
            $apply
        }

        #[doc(hidden)]
        #[unsafe(export_name = "on_finish_apply")]
        pub extern "C" fn __on_finish_apply() -> bool $on_finish_apply

        #[doc(hidden)]
        #[unsafe(export_name = "value")]
        pub extern "C" fn __value(ptr: *mut u8, size: usize) -> f64 {
            // SAFETY: FFI boundary, TextEncoder() encodes UTF-8
            let $value_json = unsafe { ::core::str::from_utf8_unchecked(::core::slice::from_raw_parts(ptr, size)) };
            $value
        }

        #[doc(hidden)]
        #[unsafe(export_name = "samples")]
        pub extern "C" fn __samples(ptr: *mut u8, size: usize) -> usize {
            // SAFETY: FFI boundary, TextEncoder() encodes UTF-8
            let $samples_json = unsafe { ::core::str::from_utf8_unchecked(::core::slice::from_raw_parts(ptr, size)) };
            $samples
        }
    };
}

#[macro_export]
macro_rules! export_percentile_property_file {
    ($filename:literal) => {
        const __PERCENTILE_PROPERTY: &[u8] = include_bytes!($filename);

        #[unsafe(link_section = "percentile_property")]
        pub static __PERCENTILE_PROPERTY_STATIC: [u8; __PERCENTILE_PROPERTY.len()] = {
            let mut out = [0; __PERCENTILE_PROPERTY.len()];
            let mut i = 0;
            while i < __PERCENTILE_PROPERTY.len() {
                out[i] = __PERCENTILE_PROPERTY[i];
                i += 1;
            }
            out
        };
    };
}

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
