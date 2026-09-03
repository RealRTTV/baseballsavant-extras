// for<T: * realm> T realm -> background realm -> T realm

import type {CURRENT_TASK_QUEUE_STATE} from "@/entrypoints/background/statcast.ts";

const MESSAGE_NAME: string = 'baseballsavant-extras:statcast-calculations-state';

export type StatcastCalculationsState = {
    message: string;
}

export function isStatcastCalculationsState(type: any): boolean {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export async function requestStatcastCalculationsState(): Promise<typeof CURRENT_TASK_QUEUE_STATE> {
    return await browser.runtime.sendMessage<StatcastCalculationsState, typeof CURRENT_TASK_QUEUE_STATE>({ message: MESSAGE_NAME });
}
