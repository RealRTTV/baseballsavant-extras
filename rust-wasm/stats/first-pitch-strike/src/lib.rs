#![allow(static_mut_refs)]

use fxhash::{FxBuildHasher, FxHashMap};
use serde::{Deserialize, Serialize};
use shared::{export_percentile_property_file, export_ffi};

export_percentile_property_file!("percentile_property.json");

#[derive(Serialize, Deserialize)]
struct Cache {
    by_player: FxHashMap<u32, PlayerCache>,
    cached_dates: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    qualification_threshold: Option<usize>,
}

#[derive(Serialize, Deserialize)]
struct PlayerCache {
    success: usize,
    samples: usize,
}

static mut CACHE: Cache = Cache {
    by_player: FxHashMap::with_hasher(FxBuildHasher::new()),
    cached_dates: vec![],
    qualification_threshold: None,
};

export_ffi! {
    fn deserialize_cache(json: &str) {
        let cache = serde_json::from_str::<Cache>(json).expect("Failed to deserialize cache");
        // SAFETY: this stage is synchronous because it's called from a JS realm.
        unsafe { CACHE = cache; }
    }

    fn serialize_cache() -> impl AsRef<str> {
        serde_json::to_string(unsafe { &CACHE }).expect("Failed to serialize cache")
    }

    fn on_incremental() {}

    fn apply(csv: &str) {
        todo!()
    }

    fn on_finish_apply() -> bool { false }

    fn value(json: &str) -> f64 {
        let player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        player.success as f64 / player.samples as f64
    }

    fn samples(json: &str) -> usize {
        let player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        player.samples
    }
}
