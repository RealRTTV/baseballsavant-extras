const textarea: HTMLTextAreaElement | null = document.querySelector('textarea#config-textarea')! as HTMLTextAreaElement;
const textareaConsole: HTMLSpanElement | null = document.querySelector('span#config-textarea-console') as HTMLSpanElement;

export function setTextareaConsoleError(error: any) {
    if (textareaConsole !== null) {
        textareaConsole.innerHTML = String(error);
        textareaConsole.style.color = `var(--error-red)`;
        textareaConsole.style.display = `block`;
    }
    if (textarea !== null) {
        textarea.style.borderColor = `var(--error-red)`;
    }
}

export function setTextareaConsoleSuccess() {
    if (textareaConsole !== null) {
        textareaConsole.style.display = 'none';
    }

    if (textarea !== null) {
        textarea.style.borderColor = `lightgreen`;
    }
}

export function enableLoadingAnimation(query: string) {
    const element = document.querySelector(query);
    element?.classList.add('is-enabled');
}

export function disableLoadingAnimation(query: string) {
    const element = document.querySelector(query);
    element?.classList.remove('is-enabled');
}
