// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

function getItemFromChromeStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function(data) {
      resolve(data);
    });
  });
}




//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.done && request.done === "yes") {
      console.log('Gotime!');
      localStorage.clear();
      chrome.storage.local.get(null, function (data) { 
        for(var key in data) {
          localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });
    }
});


chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  chrome.browserAction.disable(tabId);
    if (info.status === 'complete') {
      if (tab.url.match(/(.+).myshopify.com\/admin/) || tab.url.match(/(.+).myshopify.com\//)) {
        chrome.browserAction.enable(tabId);
      }
    }
});