/// Subsidiary Rows for Glove / Target Positions
export interface SubsidiaryRow {
    /// Game PK ID
    ss__game_pk: number | null;
    /// At Bat # (same as StatcastRow)
    ss__at_bat_number: number | null;
    /// Pitch # (same as StatcastRow)
    ss__pitch_number: number | null;
    /// Play UUID
    ss__play_id: string | null;
    /// Not a park name actually, team abbreviation.
    ss__park: string | null;
    /// Catcher assumed depth (typically -1.75 ft)
    ss__y_depth_ft: number | null;
    /// Ball position
    ss__plate_x_in: number | null;
    /// Ball position
    ss__plate_z_in: number | null;
    /// Release seconds hint, unused here
    ss__release_s: number | null;
    ss__status: string | null;
    ss__target_frame: number | null;
    /// Glove position
    ss__naive_x_in: number | null;
    /// Glove position
    ss__naive_z_in: number | null;
    /// Whether this sample is plausible.
    // Should be used as a filter for which to sample and which to now
    ss__plausible: string | null;
    /// Inferred target position
    ss__inferred_x_in: number | null;
    /// Inferred target position
    ss__inferred_z_in: number | null;
}
