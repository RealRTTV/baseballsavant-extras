import type {ExtendedPercentileProperty} from "@/utils/stats";

const MESSAGE_NAME = "baseballsavant-extras:request-loaded-custom-stat-properties";

export type RequestLoadedCustomStatProperties = {
    message: typeof MESSAGE_NAME,
}

export function isRequestLoadedCustomStatProperties(type: any): type is RequestLoadedCustomStatProperties {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export async function sendRequestLoadedCustomStatProperties(): Promise<ExtendedPercentileProperty[]> {
    return await browser.runtime.sendMessage({
        message: MESSAGE_NAME,
    } satisfies RequestLoadedCustomStatProperties).catch(console.error);
}
