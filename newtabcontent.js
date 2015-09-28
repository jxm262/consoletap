chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.script) {
        var scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = msg.script;
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(scriptEl);
    }
});