// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
//   chrome.browserAction.disable(tabId);
//     if (info.status === 'complete') {
//       if (tab.url.match(/(.+).myshopify.com\/admin/) || tab.url.match(/(.+).myshopify.com\//)) {
//         chrome.browserAction.enable(tabId);
//       }
//     }
// });

function getItemFromChromeStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function(data) {
      resolve(data);
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.done && request.done === "yes") {
      localStorage.clear();
      chrome.storage.local.get(null, function (data) { 
        for(var key in data) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });
    }
});