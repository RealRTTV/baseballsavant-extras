#![allow(static_mut_refs)]

use fxhash::{FxBuildHasher, FxHashMap};
use serde::{Deserialize, Serialize};
use shared::{export_ffi, export_percentile_property_file};
use std::io::Cursor;

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
    #[serde(rename = "n", with = "base64_serde")]
    misses: Vec<f32>,
}

mod base64_serde {
    use base64::{Engine, engine::general_purpose::STANDARD};
    use serde::{Deserialize, Deserializer, Serialize, Serializer, de::Error};

    pub fn deserialize<'de, D: Deserializer<'de>>(deserializer: D) -> Result<Vec<f32>, D::Error> {
        let mut buf = Vec::new();
        STANDARD.decode_vec(String::deserialize(deserializer)?.into_bytes(), &mut buf).map_err(D::Error::custom)?;
        Ok(buf.chunks_exact(4)
            .filter_map::<[u8; 4], _>(|chunk| chunk.try_into().ok())
            .map(f32::from_ne_bytes)
            .collect::<Vec<_>>())
    }

    pub fn serialize<S: Serializer>(data: &Vec<f32>, serializer: S) -> Result<S::Ok, S::Error> {
        let ptr = data.as_ptr().cast::<u8>();
        let len = data.len() * size_of::<f32>();
        STANDARD.encode(unsafe { core::slice::from_raw_parts(ptr, len) }).serialize(serializer)
    }
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
            // pitch_type: String,

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
                entry.misses.push(miss_distance as f32);
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
            *(player.misses.select_nth_unstable_by(mid, |a, b| a.total_cmp(b)).1) as f64
        }
    }

    fn samples(json: &str) -> usize {
        let player = serde_json::from_str::<PlayerCache>(json).expect("Failed to deserialize player cache");
        player.misses.len()
    }
}
