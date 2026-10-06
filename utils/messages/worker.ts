/// Worker to Background Request Message
import type {ExtendedPercentileProperty} from "@/utils/stats";

export type W2BRequestMessage = {
    payload: { requestedBytesForDate: string } | { requestedSubsidiaryBytesForDate: string } | { test2: string },
    message: string;
    uuid: string;
}

export const W2B_REQUEST_MESSAGE_NAME: string = 'baseballsavant-extras:worker-to-background-REQUEST';

export function isW2BRequestMessage(type: any): type is W2BRequestMessage {
    return (typeof type === 'object' && type['message'] === W2B_REQUEST_MESSAGE_NAME && typeof type['uuid'] === "string");
}

/// Worker to Background Response Message
export type W2BResponseMessage = {
    payload: { requestedBytesForDate: Uint8Array<ArrayBuffer> } | { requestedSubsidiaryBytesForDate: Uint8Array<ArrayBuffer> } | { test2: string },
    message: string;
    uuid: string;
}

export const W2B_RESPONSE_MESSAGE_NAME: string = 'baseballsavant-extras:worker-to-background-RESPONSE';

export function isW2BResponseMessage(type: any): type is W2BResponseMessage {
    return (typeof type === 'object' && type['message'] === W2B_RESPONSE_MESSAGE_NAME && typeof type['uuid'] === "string");
}

/// Background to Worker Request Message
export type B2WRequestMessage = {
    payload:
        { registerCustomStatFromSrc: string, filename: string }
      | { removeCustomStatByFilename: string }
      | { createCacheFor: string }
      | { onIncremental: string, cache: any }
      | { apply: string, cache: any, rows: Uint8Array<ArrayBuffer>, subsidiaryRows: Uint8Array<ArrayBuffer> | undefined | null }
      | { onFinishApply: string, cache: any }
      | { valueFor: string, value: any }
      | { samplesFor: string, value: any };
    message: string;
    uuid: string;
}

export const B2W_REQUEST_MESSAGE_NAME: string = 'baseballsavant-extras:background-to-worker-REQUEST';

export function isB2WRequestMessage(type: any): type is B2WRequestMessage {
    return (typeof type === 'object' && type['message'] === B2W_REQUEST_MESSAGE_NAME && typeof type['uuid'] === "string");
}

/// Background to Worker Response Message
export type B2WResponseMessage = {
    payload: { error: string }
        | { registerCustomStatFromSrcPercentileProperties: ExtendedPercentileProperty[] }
        | { createCacheFor: any }
        | { onFinishApply: false | 'rerun' }
        | { valueFor: number }
        | { samplesFor: number };
    message: string;
    uuid: string;
}

export const B2W_RESPONSE_MESSAGE_NAME: string = 'baseballsavant-extras:background-to-worker-RESPONSE';

export function isB2WResponseMessage(type: any): type is B2WResponseMessage {
    return (typeof type === 'object' && type['message'] === B2W_RESPONSE_MESSAGE_NAME && typeof type['uuid'] === "string");
}
