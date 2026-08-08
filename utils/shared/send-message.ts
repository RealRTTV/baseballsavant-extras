export const CHANNEL_MARKER: string = 'savant-extras';

export type Request = {
    __ext: 'request',
    marker: string,
    id: number,
    payload: object,
};

export type Response = {
    __ext: 'response',
    marker: string,
    id: number,
    payload: object,
    err?: string,
};

export function isRequest(data: unknown): data is Request {
    return (
        typeof data === 'object' &&
        data !== null &&
        (data as Request).__ext === 'request' &&
        (data as Request).marker == CHANNEL_MARKER &&
        typeof (data as Request).id === 'number'
    )
}

export function isResponse(data: unknown): data is Response {
    return (
        typeof data === 'object' &&
        data !== null &&
        (data as Response).__ext === 'response' &&
        (data as Response).marker == CHANNEL_MARKER &&
        typeof (data as Response).id === 'number'
    )
}
