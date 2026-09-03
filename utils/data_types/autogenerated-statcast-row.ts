// @ts-nocheck

// To parse this data:
//
//   import { Convert } from "./statcast_row";
//
//   const statcastRow = Convert.toStatcastRow(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface StatcastRow {
    pitch_type:                               PitchType | null;
    game_date:                                Date;
    release_speed:                            number | null;
    release_pos_x:                            number | null;
    release_pos_z:                            number | null;
    player_name:                              string;
    batter:                                   number;
    pitcher:                                  number;
    events:                                   Events | null;
    description:                              Description;
    spin_dir:                                 null;
    spin_rate_deprecated:                     null;
    break_angle_deprecated:                   null;
    break_length_deprecated:                  null;
    zone:                                     number | null;
    des:                                      null | string;
    game_type:                                GameType;
    stand:                                    PThrows;
    p_throws:                                 PThrows;
    home_team:                                Team;
    away_team:                                Team;
    type:                                     Type;
    hit_location:                             number | null;
    bb_type:                                  BbType | null;
    balls:                                    number;
    strikes:                                  number;
    game_year:                                number;
    pfx_x:                                    number | null;
    pfx_z:                                    number | null;
    plate_x:                                  number | null;
    plate_z:                                  number | null;
    on_3b:                                    number | null;
    on_2b:                                    number | null;
    on_1b:                                    number | null;
    outs_when_up:                             number;
    inning:                                   number;
    inning_topbot:                            InningTopbot;
    hc_x:                                     number | null;
    hc_y:                                     number | null;
    tfs_deprecated:                           null;
    tfs_zulu_deprecated:                      null;
    umpire:                                   null;
    sv_id:                                    null;
    vx0:                                      number | null;
    vy0:                                      number | null;
    vz0:                                      number | null;
    ax:                                       number | null;
    ay:                                       number | null;
    az:                                       number | null;
    sz_top:                                   number | null;
    sz_bot:                                   number | null;
    hit_distance_sc:                          number | null;
    launch_speed:                             number | null;
    launch_angle:                             number | null;
    effective_speed:                          number | null;
    release_spin_rate:                        number | null;
    release_extension:                        number | null;
    game_pk:                                  number;
    fielder_2:                                number;
    fielder_3:                                number;
    fielder_4:                                number;
    fielder_5:                                number;
    fielder_6:                                number;
    fielder_7:                                number;
    fielder_8:                                number;
    fielder_9:                                number;
    release_pos_y:                            number | null;
    estimated_ba_using_speedangle:            number | null;
    estimated_woba_using_speedangle:          number | null;
    woba_value:                               number | null;
    woba_denom:                               number | null;
    babip_value:                              number | null;
    iso_value:                                number | null;
    launch_speed_angle:                       number | null;
    at_bat_number:                            number;
    pitch_number:                             number;
    pitch_name:                               PitchName | null;
    home_score:                               number;
    away_score:                               number;
    bat_score:                                number;
    fld_score:                                number;
    post_away_score:                          number;
    post_home_score:                          number;
    post_bat_score:                           number;
    post_fld_score:                           number;
    if_fielding_alignment:                    FFieldingAlignment | null;
    of_fielding_alignment:                    FFieldingAlignment | null;
    spin_axis:                                number | null;
    delta_home_win_exp:                       number;
    delta_run_exp:                            number | null;
    bat_speed:                                number | null;
    swing_length:                             number | null;
    miss_distance:                            number | null;
    estimated_slg_using_speedangle:           number | null;
    delta_pitcher_run_exp:                    number | null;
    hyper_speed:                              number | null;
    home_score_diff:                          number;
    bat_score_diff:                           number;
    home_win_exp:                             number;
    bat_win_exp:                              number;
    age_pit_legacy:                           number;
    age_bat_legacy:                           number;
    age_pit:                                  number;
    age_bat:                                  number;
    n_thruorder_pitcher:                      number;
    n_priorpa_thisgame_player_at_bat:         number;
    pitcher_days_since_prev_game:             number | null;
    batter_days_since_prev_game:              number | null;
    pitcher_days_until_next_game:             number | null;
    batter_days_until_next_game:              number | null;
    api_break_z_with_gravity:                 number | null;
    api_break_x_arm:                          number | null;
    api_break_x_batter_in:                    number | null;
    arm_angle:                                number | null;
    attack_angle:                             number | null;
    attack_direction:                         number | null;
    swing_path_tilt:                          number | null;
    intercept_ball_minus_batter_pos_x_inches: number | null;
    intercept_ball_minus_batter_pos_y_inches: number | null;
}

export type Team = "CLE" | "STL" | "SF" | "BOS" | "AZ" | "CHC" | "NYY" | "KC" | "SEA" | "PHI" | "TB" | "NYM" | "LAA" | "HOU" | "LAD" | "ATH" | "TEX" | "SD" | "ATL" | "MIN" | "DET" | "MIA" | "CWS" | "PIT" | "WSH" | "CIN" | "COL" | "TOR" | "MIL" | "BAL";

export type BbType = "ground_ball" | "fly_ball" | "line_drive" | "popup";

export type Description = "hit_into_play" | "foul" | "called_strike" | "ball" | "swinging_strike" | "blocked_ball" | "foul_tip" | "swinging_strike_blocked" | "hit_by_pitch" | "foul_bunt" | "missed_bunt" | "automatic_ball" | "automatic_strike" | "pitchout";

export type Events = "single" | "walk" | "strikeout" | "field_out" | "home_run" | "double" | "grounded_into_double_play" | "sac_fly" | "truncated_pa" | "triple" | "force_out" | "sac_bunt" | "hit_by_pitch" | "double_play" | "fielders_choice" | "field_error" | "fielders_choice_out" | "sac_fly_double_play" | "catcher_interf" | "strikeout_double_play" | "intent_walk";

export type GameType = "S" | "R";

export type FFieldingAlignment = "Standard" | "Infield shade" | "Strategic";

export type InningTopbot = "Top" | "Bot";

export type PThrows = "R" | "L";

export type PitchName = "4-Seam Fastball" | "Curveball" | "Changeup" | "Cutter" | "Slider" | "Sinker" | "Sweeper" | "Split-Finger" | "Knuckle Curve" | "Slurve" | "Screwball" | "Forkball" | "Knuckleball" | "Pitch Out" | "Slow Curve" | "Unknown";

export type PitchType = "FF" | "CU" | "CH" | "FC" | "SL" | "SI" | "ST" | "FS" | "KC" | "SV" | "SC" | "FO" | "KN" | "PO" | "CS" | "UN";

export type Type = "X" | "S" | "B";

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toStatcastRow(json: string): StatcastRow[] {
        return cast(JSON.parse(json), a(r("StatcastRow")));
    }

    public static statcastRowToJson(value: StatcastRow[]): string {
        return JSON.stringify(uncast(value, a(r("StatcastRow"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "StatcastRow": o([
        { json: "pitch_type", js: "pitch_type", typ: u(r("PitchType"), null) },
        { json: "game_date", js: "game_date", typ: Date },
        { json: "release_speed", js: "release_speed", typ: u(3.14, null) },
        { json: "release_pos_x", js: "release_pos_x", typ: u(3.14, null) },
        { json: "release_pos_z", js: "release_pos_z", typ: u(3.14, null) },
        { json: "player_name", js: "player_name", typ: "" },
        { json: "batter", js: "batter", typ: 0 },
        { json: "pitcher", js: "pitcher", typ: 0 },
        { json: "events", js: "events", typ: u(r("Events"), null) },
        { json: "description", js: "description", typ: r("Description") },
        { json: "spin_dir", js: "spin_dir", typ: null },
        { json: "spin_rate_deprecated", js: "spin_rate_deprecated", typ: null },
        { json: "break_angle_deprecated", js: "break_angle_deprecated", typ: null },
        { json: "break_length_deprecated", js: "break_length_deprecated", typ: null },
        { json: "zone", js: "zone", typ: u(0, null) },
        { json: "des", js: "des", typ: u(null, "") },
        { json: "game_type", js: "game_type", typ: r("GameType") },
        { json: "stand", js: "stand", typ: r("PThrows") },
        { json: "p_throws", js: "p_throws", typ: r("PThrows") },
        { json: "home_team", js: "home_team", typ: r("Team") },
        { json: "away_team", js: "away_team", typ: r("Team") },
        { json: "type", js: "type", typ: r("Type") },
        { json: "hit_location", js: "hit_location", typ: u(0, null) },
        { json: "bb_type", js: "bb_type", typ: u(r("BbType"), null) },
        { json: "balls", js: "balls", typ: 0 },
        { json: "strikes", js: "strikes", typ: 0 },
        { json: "game_year", js: "game_year", typ: 0 },
        { json: "pfx_x", js: "pfx_x", typ: u(3.14, null) },
        { json: "pfx_z", js: "pfx_z", typ: u(3.14, null) },
        { json: "plate_x", js: "plate_x", typ: u(3.14, null) },
        { json: "plate_z", js: "plate_z", typ: u(3.14, null) },
        { json: "on_3b", js: "on_3b", typ: u(0, null) },
        { json: "on_2b", js: "on_2b", typ: u(0, null) },
        { json: "on_1b", js: "on_1b", typ: u(0, null) },
        { json: "outs_when_up", js: "outs_when_up", typ: 0 },
        { json: "inning", js: "inning", typ: 0 },
        { json: "inning_topbot", js: "inning_topbot", typ: r("InningTopbot") },
        { json: "hc_x", js: "hc_x", typ: u(3.14, null) },
        { json: "hc_y", js: "hc_y", typ: u(3.14, null) },
        { json: "tfs_deprecated", js: "tfs_deprecated", typ: null },
        { json: "tfs_zulu_deprecated", js: "tfs_zulu_deprecated", typ: null },
        { json: "umpire", js: "umpire", typ: null },
        { json: "sv_id", js: "sv_id", typ: null },
        { json: "vx0", js: "vx0", typ: u(3.14, null) },
        { json: "vy0", js: "vy0", typ: u(3.14, null) },
        { json: "vz0", js: "vz0", typ: u(3.14, null) },
        { json: "ax", js: "ax", typ: u(3.14, null) },
        { json: "ay", js: "ay", typ: u(3.14, null) },
        { json: "az", js: "az", typ: u(3.14, null) },
        { json: "sz_top", js: "sz_top", typ: u(3.14, null) },
        { json: "sz_bot", js: "sz_bot", typ: u(3.14, null) },
        { json: "hit_distance_sc", js: "hit_distance_sc", typ: u(0, null) },
        { json: "launch_speed", js: "launch_speed", typ: u(3.14, null) },
        { json: "launch_angle", js: "launch_angle", typ: u(0, null) },
        { json: "effective_speed", js: "effective_speed", typ: u(3.14, null) },
        { json: "release_spin_rate", js: "release_spin_rate", typ: u(0, null) },
        { json: "release_extension", js: "release_extension", typ: u(3.14, null) },
        { json: "game_pk", js: "game_pk", typ: 0 },
        { json: "fielder_2", js: "fielder_2", typ: 0 },
        { json: "fielder_3", js: "fielder_3", typ: 0 },
        { json: "fielder_4", js: "fielder_4", typ: 0 },
        { json: "fielder_5", js: "fielder_5", typ: 0 },
        { json: "fielder_6", js: "fielder_6", typ: 0 },
        { json: "fielder_7", js: "fielder_7", typ: 0 },
        { json: "fielder_8", js: "fielder_8", typ: 0 },
        { json: "fielder_9", js: "fielder_9", typ: 0 },
        { json: "release_pos_y", js: "release_pos_y", typ: u(3.14, null) },
        { json: "estimated_ba_using_speedangle", js: "estimated_ba_using_speedangle", typ: u(3.14, null) },
        { json: "estimated_woba_using_speedangle", js: "estimated_woba_using_speedangle", typ: u(3.14, null) },
        { json: "woba_value", js: "woba_value", typ: u(3.14, null) },
        { json: "woba_denom", js: "woba_denom", typ: u(0, null) },
        { json: "babip_value", js: "babip_value", typ: u(0, null) },
        { json: "iso_value", js: "iso_value", typ: u(0, null) },
        { json: "launch_speed_angle", js: "launch_speed_angle", typ: u(0, null) },
        { json: "at_bat_number", js: "at_bat_number", typ: 0 },
        { json: "pitch_number", js: "pitch_number", typ: 0 },
        { json: "pitch_name", js: "pitch_name", typ: u(r("PitchName"), null) },
        { json: "home_score", js: "home_score", typ: 0 },
        { json: "away_score", js: "away_score", typ: 0 },
        { json: "bat_score", js: "bat_score", typ: 0 },
        { json: "fld_score", js: "fld_score", typ: 0 },
        { json: "post_away_score", js: "post_away_score", typ: 0 },
        { json: "post_home_score", js: "post_home_score", typ: 0 },
        { json: "post_bat_score", js: "post_bat_score", typ: 0 },
        { json: "post_fld_score", js: "post_fld_score", typ: 0 },
        { json: "if_fielding_alignment", js: "if_fielding_alignment", typ: u(r("FFieldingAlignment"), null) },
        { json: "of_fielding_alignment", js: "of_fielding_alignment", typ: u(r("FFieldingAlignment"), null) },
        { json: "spin_axis", js: "spin_axis", typ: u(0, null) },
        { json: "delta_home_win_exp", js: "delta_home_win_exp", typ: 3.14 },
        { json: "delta_run_exp", js: "delta_run_exp", typ: u(3.14, null) },
        { json: "bat_speed", js: "bat_speed", typ: u(3.14, null) },
        { json: "swing_length", js: "swing_length", typ: u(3.14, null) },
        { json: "miss_distance", js: "miss_distance", typ: u(3.14, null) },
        { json: "estimated_slg_using_speedangle", js: "estimated_slg_using_speedangle", typ: u(3.14, null) },
        { json: "delta_pitcher_run_exp", js: "delta_pitcher_run_exp", typ: u(3.14, null) },
        { json: "hyper_speed", js: "hyper_speed", typ: u(3.14, null) },
        { json: "home_score_diff", js: "home_score_diff", typ: 0 },
        { json: "bat_score_diff", js: "bat_score_diff", typ: 0 },
        { json: "home_win_exp", js: "home_win_exp", typ: 3.14 },
        { json: "bat_win_exp", js: "bat_win_exp", typ: 3.14 },
        { json: "age_pit_legacy", js: "age_pit_legacy", typ: 0 },
        { json: "age_bat_legacy", js: "age_bat_legacy", typ: 0 },
        { json: "age_pit", js: "age_pit", typ: 0 },
        { json: "age_bat", js: "age_bat", typ: 0 },
        { json: "n_thruorder_pitcher", js: "n_thruorder_pitcher", typ: 0 },
        { json: "n_priorpa_thisgame_player_at_bat", js: "n_priorpa_thisgame_player_at_bat", typ: 0 },
        { json: "pitcher_days_since_prev_game", js: "pitcher_days_since_prev_game", typ: u(0, null) },
        { json: "batter_days_since_prev_game", js: "batter_days_since_prev_game", typ: u(0, null) },
        { json: "pitcher_days_until_next_game", js: "pitcher_days_until_next_game", typ: u(0, null) },
        { json: "batter_days_until_next_game", js: "batter_days_until_next_game", typ: u(0, null) },
        { json: "api_break_z_with_gravity", js: "api_break_z_with_gravity", typ: u(3.14, null) },
        { json: "api_break_x_arm", js: "api_break_x_arm", typ: u(3.14, null) },
        { json: "api_break_x_batter_in", js: "api_break_x_batter_in", typ: u(3.14, null) },
        { json: "arm_angle", js: "arm_angle", typ: u(3.14, null) },
        { json: "attack_angle", js: "attack_angle", typ: u(3.14, null) },
        { json: "attack_direction", js: "attack_direction", typ: u(3.14, null) },
        { json: "swing_path_tilt", js: "swing_path_tilt", typ: u(3.14, null) },
        { json: "intercept_ball_minus_batter_pos_x_inches", js: "intercept_ball_minus_batter_pos_x_inches", typ: u(3.14, null) },
        { json: "intercept_ball_minus_batter_pos_y_inches", js: "intercept_ball_minus_batter_pos_y_inches", typ: u(3.14, null) },
    ], false),
    "Team": [
        "ATH",
        "ATL",
        "AZ",
        "BAL",
        "BOS",
        "CHC",
        "CIN",
        "CLE",
        "COL",
        "CWS",
        "DET",
        "HOU",
        "KC",
        "LAA",
        "LAD",
        "MIA",
        "MIL",
        "MIN",
        "NYM",
        "NYY",
        "PHI",
        "PIT",
        "SD",
        "SEA",
        "SF",
        "STL",
        "TB",
        "TEX",
        "TOR",
        "WSH",
    ],
    "BbType": [
        "fly_ball",
        "ground_ball",
        "line_drive",
        "popup",
    ],
    "Description": [
        "automatic_ball",
        "automatic_strike",
        "ball",
        "blocked_ball",
        "called_strike",
        "foul",
        "foul_bunt",
        "foul_tip",
        "hit_by_pitch",
        "hit_into_play",
        "missed_bunt",
        "pitchout",
        "swinging_strike",
        "swinging_strike_blocked",
    ],
    "Events": [
        "catcher_interf",
        "double",
        "double_play",
        "field_error",
        "field_out",
        "fielders_choice",
        "fielders_choice_out",
        "force_out",
        "grounded_into_double_play",
        "hit_by_pitch",
        "home_run",
        "intent_walk",
        "sac_bunt",
        "sac_fly",
        "sac_fly_double_play",
        "single",
        "strikeout",
        "strikeout_double_play",
        "triple",
        "truncated_pa",
        "walk",
    ],
    "GameType": [
        "R",
        "S",
    ],
    "FFieldingAlignment": [
        "Infield shade",
        "Standard",
        "Strategic",
    ],
    "InningTopbot": [
        "Bot",
        "Top",
    ],
    "PThrows": [
        "L",
        "R",
    ],
    "PitchName": [
        "Changeup",
        "Curveball",
        "Cutter",
        "Forkball",
        "Knuckle Curve",
        "Knuckleball",
        "Pitch Out",
        "Screwball",
        "Sinker",
        "Slider",
        "Slow Curve",
        "Slurve",
        "Split-Finger",
        "Sweeper",
        "4-Seam Fastball",
        "Unknown",
    ],
    "PitchType": [
        "CS",
        "CH",
        "CU",
        "FS",
        "FC",
        "FF",
        "FO",
        "KC",
        "KN",
        "PO",
        "SC",
        "SI",
        "SL",
        "ST",
        "SV",
        "UN",
    ],
    "Type": [
        "B",
        "S",
        "X",
    ],
};
