var urls = {
    jquery: 'https://code.jquery.com/jquery-2.1.4.min.js',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js',
    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
};

function menuItemClick(e) {
    var script = urls[e.target.id];

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (tabs[0].url == "chrome://newtab/") {
            chrome.tabs.sendMessage(tabs[0].id, {script: script});
        } else {
            var loadScript = "var s = document.createElement('script');\
            s.type = 'text/javascript';\
            s.src = '" + script + "';\
            (document.getElementsByTagName('head')[0] ||document.getElementsByTagName('body')[0]).appendChild(s);";

            chrome.tabs.executeScript(null, {
                code: loadScript,
                allFrames: true
            });
        }
    });

    window.close();
};

function toggleHidden(el) {
    el.className = (el.className == 'hidden') ? '' : 'hidden';
};

document.addEventListener('DOMContentLoaded', function () {
    var menuItems = document.querySelectorAll('.js-lib');
    for (var i = 0; i < menuItems.length; i++) {
        menuItems[i].addEventListener('click', menuItemClick);
    }

    document.getElementById('settings').addEventListener('click', function (e) {
        toggleHidden(e.target);
        toggleHidden(document.getElementById('input-box'));
    });

    document.getElementById('save').addEventListener('click', function (e) {
        var name = document.getElementById('input-name').value;
        var url = document.getElementById('input-url').value;
        urls[name] = url;
        var div = document.createElement("div");
        div.innerHTML = name;
        div.id = name;

        //document.getElementsByTagName('body')[0].appendChild(div);
        console.log('url', url);
        toggleHidden(document.getElementById('input-box'));
        toggleHidden(document.getElementById('settings'));
    });

});

//refactor all this stuff to use jQuery
function setInnerHTML(element, content) {
    element.innerHTML = content;
    return element;
};

