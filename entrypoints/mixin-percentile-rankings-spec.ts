export default defineUnlistedScript(() => {
    (globalThis as any).__savantExtras = {
        onSpec(spec: Record<string, any>) {
            spec.batting.props = [
                {
                    "label": "wOBA",
                    "value": "woba",
                    "percent_value": "percent_rank_woba"
                },
                {
                    "label": "AVG",
                    "value": "ba",
                    "percent_value": "percent_rank_ba"
                },
                {
                    "label": "SLG",
                    "value": "slg",
                    "percent_value": "percent_rank_slg"
                },
                {
                    "label": "Max Exit Velo",
                    "value": "exit_velocity_max",
                    "percent_value": "percent_rank_exit_velocity_max"
                },
                {
                    "label": "Barrels",
                    "value": "barrel",
                    "percent_value": "percent_rank_barrel"
                },
                {
                    "label": "wOBAcon",
                    "value": "wobacon",
                    "percent_value": "percent_rank_wobacon"
                },
                {
                    "label": "xISO",
                    "value": "xiso",
                    "percent_value": "percent_rank_xiso"
                },
                {
                    "label": "Avg Home Run (ft.)",
                    "value": "distance_hr_avg",
                    "percent_value": "percent_rank_distance_hr_avg"
                },
                {
                    "label": "Pulled Flyball %",
                    "value": "pull_percent_airballs",
                    "percent_value": "percent_rank_pull_percent_airballs"
                },
                {
                    "label": "HYPERSPEED",
                    "value": "avg_hyper_speed",
                    "percent_value": "percent_rank_avg_hyper_speed",
                },
                {
                    "label": "Best. Speed.",
                    "value": "avg_best_speed",
                    "percent_value": "percent_rank_avg_best_speed",
                },
                {
                    "label": "S.Z. Judgement",
                    "value": "sz_judge",
                    "percent_value": "percent_rank_sz_judge",
                    "inverse": true
                },
                {
                    "label": "GB %",
                    "value": "groundballs_percent",
                    "percent_value": "percent_rank_groundballs_percent",
                    "inverse": true
                }
            ];
            spec.pitching.props.push({
                "label": "FPS %",
                "value": "first_pitch_strike",
                "percent_value": "percent_rank_first_pitch_strike"
            });
        }
    };
});
