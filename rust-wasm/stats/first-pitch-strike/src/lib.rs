use shared::log;

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
pub extern "C" fn main() {
    log("hi mom");
}
