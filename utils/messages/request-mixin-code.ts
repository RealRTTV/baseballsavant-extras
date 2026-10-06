import type {ResponseMixinCode} from "@/utils/messages/response-mixin-code.ts";

const MESSAGE_NAME = "baseballsavant-extras:request-mixin-code";

export type RequestMixinCode = {
    message: typeof MESSAGE_NAME,
    url: string;
    bundleUrl: string;
}

export async function requestMixinCode(url: string, bundleUrl: string): Promise<ResponseMixinCode> {
    return await browser.runtime.sendMessage({
        url,
        bundleUrl,
        message: MESSAGE_NAME,
    } satisfies RequestMixinCode);
}

export function isRequestMixinCode(type: any): type is RequestMixinCode {
    return typeof type === "object" && type['message'] === MESSAGE_NAME;
}
