// sidepanel realm -> background realm

const MESSAGE_NAME = "baseballsavant-extras:request-add-custom-stat";

export type RequestAddCustomStat = {
    message: typeof MESSAGE_NAME;
    filename: string;
    contents: Uint8Array<ArrayBuffer>
}

export function isRequestAddCustomStat(type: any): type is RequestAddCustomStat {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export async function requestAddCustomStat(filename: string, contents: Uint8Array<ArrayBuffer>): Promise<void> {
    await browser.runtime.sendMessage({
        message: MESSAGE_NAME,
        filename,
        contents,
    } satisfies RequestAddCustomStat);
}
