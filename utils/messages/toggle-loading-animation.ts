// * realm -> side-panel realm

const MESSAGE_NAME: string = 'baseballsavant-extras:toggle-loading-animation';

export type ToggleLoadingAnimation = {
    message: string;
    selector: string;
    state?: boolean;
}

export function isToggleLoadingAnimation(type: any): type is ToggleLoadingAnimation {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export function requestToggleLoadingAnimation(selector: string, state: boolean) {
    const request = {
        message: MESSAGE_NAME,
        selector,
        state,
    };
    browser.runtime.sendMessage(request).then(_ => {});
}
