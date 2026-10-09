// * realm -> extension realm

const MESSAGE_NAME: string = 'baseballsavant-extras:rerun-statcast-data-calculations';

export function isRerunStatcastDataCalculations(type: any): boolean {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export function requestRerunStatcastDataCalculations() {
    const request = {
        message: MESSAGE_NAME,
    };
    browser.runtime.sendMessage(request).then(_ => {});
}
