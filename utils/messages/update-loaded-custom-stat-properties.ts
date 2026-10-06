import type {ExtendedPercentileProperty} from "@/utils/stats";

const MESSAGE_NAME = "baseballsavant-extras:update-loaded-custom-stat-properties";

export type UpdateLoadedCustomStatProperties = {
    message: typeof MESSAGE_NAME,
    props: ExtendedPercentileProperty[],
}

export function isUpdateLoadedCustomStatProperties(type: any): type is UpdateLoadedCustomStatProperties {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export async function sendUpdateLoadedCustomStatProperties(props: ExtendedPercentileProperty[]) {
    await browser.runtime.sendMessage({
        message: MESSAGE_NAME,
        props,
    } satisfies UpdateLoadedCustomStatProperties).catch(_ => {});
}
