const sandbox = document.querySelector('iframe')?.contentWindow!;

browser.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    window.addEventListener('message', event => sendResponse(event.data), { once: true });
    sandbox.postMessage(msg, "*");
    return true;
});
