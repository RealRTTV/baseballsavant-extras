import {onConfigWrite, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/extension/config.ts";
import {DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError, setTextareaConsoleSuccess} from "@/entrypoints/popup/textarea-helper.ts";

export function onConfigInput(textarea: HTMLTextAreaElement) {
    try {
        onConfigWrite(textarea.value);

        setTextareaConsoleSuccess();
    } catch (e: any) {
        setTextareaConsoleError(e.message);
    }
}

const textarea: HTMLTextAreaElement | null = document.querySelector('textarea#config-textarea')! as HTMLTextAreaElement;

SAVANT_EXTRAS_CONFIG_STRING.getValue().then(CONFIG_STRING => {
    const CONFIG = CONFIG_STRING || DEFAULT_CONFIG;

    if (textarea !== null) {
        textarea.value = CONFIG;
        onConfigInput(textarea);
        textarea.addEventListener('input', _ => onConfigInput(textarea));
    }
});
