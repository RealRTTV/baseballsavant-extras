window.addEventListener('message', event => {
    console.log('sandbox got:', event.data);
    const src: string = event.data;
    const result = eval(src);
    event.source!.postMessage(result, { targetOrigin: event.origin });
})