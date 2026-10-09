// sidepanel realm -> background realm

const MESSAGE_NAME = "baseballsavant-extras:request-remove-custom-stat-file";

export type RequestRemoveCustomStatFile = {
    message: typeof MESSAGE_NAME;
    filename: string;
}

export function isRequestRemoveCustomStatFile(type: any): type is RequestRemoveCustomStatFile {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export async function requestRemoveCustomStatFile(filename: string): Promise<void> {
    await browser.runtime.sendMessage({
        message: MESSAGE_NAME,
        filename
    } satisfies RequestRemoveCustomStatFile);
}
