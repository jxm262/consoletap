// Note, I'm not using JQuery or other helper libs so I can keep the filesize down
var supportsSyncFileSystem = chrome && chrome.syncFileSystem;

var defaultUrls = {
    jquery: 'https://code.jquery.com/jquery-2.1.4.min.js',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js',
    underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
};

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
            }
        }
    });

};

function toggleHidden(el) {
    el.className = (el.className == 'hidden') ? '' : 'hidden';
};

function getStorage(name, cb) {
    chrome.storage.sync.get(name, function(item) {
        //todo add error handling
        cb(item);
    });
};

function init(cb) {
    getStorage("consoletap", function (item) {
        if (!(item && item.consoletap && item.consoletap.urls)) {
            chrome.storage.sync.set({ consoletap : {urls:  defaultUrls}}, function() {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                } else {
                    console.log('initialized default urls obj');
                }
                cb(defaultUrls);
                window.close();
            });
        } else {
            cb(items.consoletap.urls);
        }
    });

    chrome.storage.sync.get("consoletap", function(items) {
        if (!chrome.runtime.error) {

            if (!(items && items.consoletap && items.consoletap.urls)) {
                chrome.storage.sync.set({ consoletap : {urls:  defaultUrls}}, function() {
                    if (chrome.runtime.error) {
                        console.log("Runtime error.");
                    } else {
                        console.log('initialized default urls obj');
                    }
                    cb(defaultUrls);
                    window.close();
                });
            } else {
                cb(items.consoletap.urls);
            }
        }
    });
};

function createMenuItem(item) {
    var div = document.createElement("div");
    div.innerHTML = item.name;
    div.className = item.className;
    div.id = item.id;
    return div;
};

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

function setStorage(item, cb) {
    chrome.storage.sync.set(item, function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        } else {
            console.log('initialized default urls obj');
        }
        cb();
        window.close();
    });
};

function setInnerHTML(element, content) {
    element.innerHTML = content;
    return element;
};

document.addEventListener('DOMContentLoaded', function () {
    var menu = document.getElementsByClassName('menu')[0];
    var settings = document.getElementById('settings');

    init(function (urls) {
        //todo dynamically create and add to dom
        for (var key in urls) {
            var div = createMenuItem({name: key, id: key, className: 'js-lib'});
            menu.insertBefore(div, settings);
        }

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



            var inputBox = document.getElementById('input-box');
            menu.insertBefore(div, settings);

            saveLib({name: name, url: url});

            toggleHidden(inputBox);
            toggleHidden(settings);
        });
    });
});
