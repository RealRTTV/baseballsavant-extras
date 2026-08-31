import {rerunStatcastDataCalculations} from "@/utils/extension/statcast.ts";

const MESSAGE_NAME: string = 'baseballsavant-extras:rerun-statcast-data-calculations';

function isRequest(type: any): boolean {
    return (typeof type === 'object' && type['message'] === MESSAGE_NAME);
}

export function sendRerunStatcastDataCalculationsRequest() {
    const request = {
        message: MESSAGE_NAME,
    };
    browser.runtime.sendMessage(request).then(_ => {});
}

export function rerunStatcastDataCalculationsRequestHandler(message: any, _sender: unknown, _sendResponse: (response?: any) => void): void {
    if (isRequest(message)) {
        rerunStatcastDataCalculations();
    }
}
