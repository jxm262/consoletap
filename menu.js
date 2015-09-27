var urls = {
    jquery: 'https://code.jquery.com/jquery-2.1.4.min.js',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js',
    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
};

function menuItemClick(e) {
    var script = urls[e.target.id];

    var loadScript = "var s = document.createElement('script');\
    s.type = 'text/javascript';\
    s.src = '" + script + "';\
    (document.getElementsByTagName('head')[0] ||document.getElementsByTagName('body')[0]).appendChild(s);";

    chrome.tabs.executeScript(null,{code:loadScript, allFrames: true});

    window.close();
};

document.addEventListener('DOMContentLoaded', function() {
    var menuItems = document.querySelectorAll('.menu-item');
    for (var i=0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', menuItemClick);
    }
});
