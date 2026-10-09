import type {PercentileProperty} from "@/utils/stats/module.ts";

export const FASTBALL_VELO: PercentileProperty = {
    label: "Fastball Velo",
    value: "fastball_velo",
    percent_value: "percent_rank_fastball_velo",
    description: "Average Fastball Velocity",
};

export const FASTBALL_SPIN: PercentileProperty = {
    label: "Fastball Spin",
    value: "fastball_spin",
    percent_value: "percent_rank_fastball_spin",
    description: "Fastball Spin Rate (Raw RPMs, not effective)",
};

export const EXTENSION: PercentileProperty = {
    label: "Extension",
    value: "fastball_extension",
    percent_value: "percent_rank_fastball_extension",
    description: "Pitcher extension on fastballs",
};

export const CURVEBALL_SPIN: PercentileProperty = {
    label: "Curveball Spin",
    value: "cu_spin",
    percent_value: "percent_rank_cu_spin",
    description: "Curveball Spin Rate (Raw RPMs, not effective)",
};

export const EXPECTED_ERA: PercentileProperty = {
    label: "xERA",
    value: "xera",
    percent_value: "percent_rank_xera",
    description: "xERA is a simple 1:1 translation of xwOBA, converted to the ERA scale.",
};
