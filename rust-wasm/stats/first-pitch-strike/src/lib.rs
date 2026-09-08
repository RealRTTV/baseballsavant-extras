#![allow(static_mut_refs)]

use std::io::Cursor;
use fxhash::{FxBuildHasher, FxHashMap};
use serde::{Deserialize, Serialize};
use shared::{export_percentile_property_file, export_ffi};

export_percentile_property_file!("percentile_property.json");

#[derive(Serialize, Deserialize, Default)]
struct Cache {
    by_player: FxHashMap<u32, PlayerCache>,
    cached_dates: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    qualification_threshold: Option<usize>,
}

#[derive(Serialize, Deserialize, Default)]
struct PlayerCache {
    #[serde(rename = "n")]
    success: usize,
    #[serde(rename = "t")]
    samples: usize,
}

static mut CACHE: Cache = Cache {
    by_player: FxHashMap::with_hasher(FxBuildHasher::new()),
    cached_dates: vec![],
    qualification_threshold: None,
};

export_ffi! {
    fn deserialize_cache(json: &str) {
        let cache = serde_json::from_str::<Cache>(json).unwrap_or_default();
        // SAFETY: this stage is synchronous because it's called from a JS realm.
        unsafe { CACHE = cache; }
    }

    fn serialize_cache() -> String {
        serde_json::to_string(unsafe { &CACHE }).expect("Failed to serialize cache")
    }

    fn on_incremental() {}

    fn apply(csv: &str) {
        #[derive(Deserialize)]
        struct Row {
            balls: u8,
            strikes: u8,
            r#type: char,
            pitcher: u32,
        }

        for row in csv::Reader::from_reader(Cursor::new(csv))
            .deserialize::<Row>()
            .filter_map(Result::ok)
            .filter(|row| row.balls == 0 && row.strikes == 0) {
            let map = unsafe { &mut CACHE.by_player };
            let entry = map.entry(row.pitcher).or_insert_with(Default::default);
            entry.samples += 1;
            entry.success += matches!(row.r#type, 'S' | 'X') as usize;
        }
    }

    fn on_finish_apply() -> bool { false }

    fn value(json: &str) -> f64 {
        let player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        100.0 * player.success as f64 / player.samples as f64
    }

    fn samples(json: &str) -> usize {
        let player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        player.samples
    }
}
