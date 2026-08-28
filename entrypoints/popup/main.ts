import {onConfigWrite, type ParsedConfig, SAVANT_EXTRAS_CONFIG_STRING} from "@/utils/extension/config.ts";
import {DEFAULT_CONFIG} from "@/utils/extension/config-consts.ts";
import {setTextareaConsoleError, setTextareaConsoleSuccess} from "@/entrypoints/popup/textarea-helper.ts";
import {rerunStatcastDataCalculations} from "@/utils/extension/statcast.ts";
import {sendRerunStatcastDataCalculationsRequest} from "@/utils/shared/messages/rerun-statcast-data-calculations.ts";

export function onConfigInput(textarea: HTMLTextAreaElement) {
    try {
        const config = onConfigWrite(textarea.value);
        onConfig(config);
        setTextareaConsoleSuccess();
    } catch (e: any) {
        setTextareaConsoleError(e.message);
    }
}

SAVANT_EXTRAS_CONFIG_STRING.getValue().then(CONFIG_STRING => {
    const textarea: HTMLTextAreaElement | null = document.querySelector('textarea#config-textarea')! as HTMLTextAreaElement;
    const CONFIG = CONFIG_STRING || DEFAULT_CONFIG;

    if (textarea !== null) {
        textarea.value = CONFIG;
        onConfigInput(textarea);
        textarea.addEventListener('input', _ => onConfigInput(textarea));
    }
});

function onConfig(config: ParsedConfig) {
    console.log(config.activeYears);
    sendRerunStatcastDataCalculationsRequest();
}
