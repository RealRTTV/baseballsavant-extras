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
    misses: Vec<f64>,
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

    fn apply(csv: &str, subsidiary_csv: &str) {
        #[derive(PartialEq, Eq, PartialOrd, Ord, Copy, Clone, Hash)]
        struct Identifier {
            game_pk: i64,
            at_bat_number: u32,
            pitch_number: u32,
        }

        #[derive(Deserialize)]
        struct StatcastRow {
            game_pk: i64,
            at_bat_number: u32,
            pitch_number: u32,
//             pitch_type: String,

            pitcher: u32,
        }

        #[derive(Deserialize, Debug)]
        struct SubsidiaryRow {
            #[serde(rename = "ss__game_pk")]
            game_pk: i64,
            #[serde(rename = "ss__at_bat_number")]
            at_bat_number: u32,
            #[serde(rename = "ss__pitch_number")]
            pitch_number: u32,

            #[serde(rename = "ss__plate_x_in")]
            plate_x_in: f64,
            #[serde(rename = "ss__plate_z_in")]
            plate_z_in: f64,
            #[serde(rename = "ss__inferred_x_in")]
            inferred_x_in: f64,
            #[serde(rename = "ss__inferred_z_in")]
            inferred_z_in: f64,
            #[serde(rename = "ss__plausible")]
            plausible: String,
        }

        let map = csv::Reader::from_reader(Cursor::new(subsidiary_csv))
            .into_deserialize::<SubsidiaryRow>()
            .filter_map(Result::ok)
            .map(|row @ SubsidiaryRow { game_pk, at_bat_number, pitch_number, .. }| (Identifier { game_pk, at_bat_number, pitch_number }, row))
            .collect::<FxHashMap<Identifier, SubsidiaryRow>>();

        for StatcastRow { pitcher, /*pitch_type,*/ game_pk, at_bat_number, pitch_number } in csv::Reader::from_reader(Cursor::new(csv)).into_deserialize::<StatcastRow>().filter_map(Result::ok) {
            let Some(SubsidiaryRow { plate_x_in, plate_z_in, inferred_x_in, inferred_z_in, plausible, .. }) = map.get(&Identifier { game_pk, at_bat_number, pitch_number }) else { continue };

            if plausible != "True" {
                continue
            }

//             if !matches!(pitch_type.as_str(), "FF" | "FC" | "SI") {
//                 continue
//             }

            let map = unsafe { &mut CACHE.by_player };
            let entry = map.entry(pitcher).or_insert_with(Default::default);
            let miss_distance = f64::hypot(plate_x_in - inferred_x_in, plate_z_in - inferred_z_in);
            if !miss_distance.is_nan() {
                entry.misses.push(miss_distance);
            }
        }
    }

    fn on_finish_apply() -> bool { false }

    fn value(json: &str) -> f64 {
        let mut player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        let mid = player.misses.len() / 2;
        if player.misses.is_empty() {
            0.0
        } else {
            *(player.misses.select_nth_unstable_by(mid, |a, b| a.total_cmp(b)).1)
        }
    }

    fn samples(json: &str) -> usize {
        let player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        player.misses.len()
    }
}
