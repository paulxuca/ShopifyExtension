var backgroundPage = chrome.extension.getBackgroundPage();
function initializeStore() {
  if(backgroundPage.localStorage.length) {
    console.log('Done!');
  } else {
    setTimeout(initializeStore, 2000);
  }
}

initializeStore();