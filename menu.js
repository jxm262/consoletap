var supportsSyncFileSystem = chrome && chrome.syncFileSystem;

//var urls = {
//    jquery: 'https://code.jquery.com/jquery-2.1.4.min.js',
//    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js',
//    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
//};

//todo move this to some persistent storage
//function urls (cb) {
//    chrome.storage.sync.get("consoletap", function(items) {
//        if (!chrome.runtime.error) {
//            cb(items);
//        }
//    });
//};

function menuItemClick(e) {

    chrome.storage.sync.get("consoletap", function(items) {
        if (!chrome.runtime.error) {
            if (items && items.consoletap && items.consoletap.urls) {
                var script = items.consoletap.urls[e.target.id];
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
                    window.close();
                });
            } else {
                var urls = {
                    jquery: 'https://code.jquery.com/jquery-2.1.4.min.js',
                    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js',
                    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
                };
                chrome.storage.sync.set({ consoletap : {urls:  urls}}, function() {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    } else {
                        console.log('initialized default urls obj');
                    }
                    window.close();
                });
            }
        }
    });

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
        var div = document.createElement("div");

        div.innerHTML = name;
        div.className = 'js-lib';
        div.id = name;

        var menu = document.getElementsByClassName('menu')[0];
        var settings = document.getElementById('settings');
        var inputBox = document.getElementById('input-box');
        menu.insertBefore(div, settings);

        saveLib({name: name, url: url});

        toggleHidden(inputBox);
        toggleHidden(settings);
    });

});

function saveLib(lib) {
    chrome.storage.sync.get('consoletap', function(items) {
        var urls = items.consoletap.urls;
        urls[lib.name] = lib.url;

        chrome.storage.sync.set({consoletap: {urls: urls}}, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            } else {
                console.log('initialized default urls obj');
            }
        });
    });
};

//refactor all this stuff to use jQuery
function setInnerHTML(element, content) {
    element.innerHTML = content;
    return element;
};

