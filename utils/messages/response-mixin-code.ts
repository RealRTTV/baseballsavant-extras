const MESSAGE_NAME = "baseballsavant-extras:response-mixin-code";

export type ResponseMixinCode = {
    message: typeof MESSAGE_NAME,
    src: string;
}

export function responseMixinCode(src: string): ResponseMixinCode {
    return {
        src,
        message: MESSAGE_NAME,
    } satisfies ResponseMixinCode;
}

export function isResponseMixinCode(type: any): type is ResponseMixinCode {
    return typeof type === "object" && type["message"] === MESSAGE_NAME;
}
