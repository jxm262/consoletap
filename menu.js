document.addEventListener('DOMContentLoaded', function() {
    var url = 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js';

    var lib = "var s = document.createElement('script');\
    s.type = 'text/javascript';\
    s.src = '" + url + "';\
    (document.getElementsByTagName('head')[0] ||document.getElementsByTagName('body')[0]).appendChild(s);";

    chrome.tabs.executeScript(null,{code:lib});
});
