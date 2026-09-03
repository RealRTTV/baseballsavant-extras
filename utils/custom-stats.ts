import type {ExtendedPercentileProperty} from "@/utils/stats";

export let ALL_REGISTERED_CUSTOM_STAT_PROPERTIES: ExtendedPercentileProperty[] = [];

export function setAllRegisteredCustomStatProperties(values: ExtendedPercentileProperty[]) {
    ALL_REGISTERED_CUSTOM_STAT_PROPERTIES = values;
}
