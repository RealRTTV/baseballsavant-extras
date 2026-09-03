// * realm -> background realm

const MESSAGE_NAME: string = 'baseballsavant-extras:refresh-custom-stats';

export function isRefreshCustomStats(type: any): boolean {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export function requestRefreshCustomStats() {
    const request = {
        message: MESSAGE_NAME,
    };
    browser.runtime.sendMessage(request).then(_ => {});
}
