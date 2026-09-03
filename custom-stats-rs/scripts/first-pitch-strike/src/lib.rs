use shared::console;

#[unsafe(no_mangle)]
pub extern "C" fn add_and_log(a: i32, b: i32) -> i32 {
    let sum = a + b;
    console::log(sum);
    sum
}