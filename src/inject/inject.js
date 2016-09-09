function parseJSONData(data, storeName) {
	var idList = data.map((each) => {
		var storedObject = {};
		storedObject[storeName + '_' + each.id] = each;
		chrome.storage.local.set(storedObject);
		return each.id;
	});
	chrome.storage.local.set({ storeName: storeName }, function(){
		chrome.extension.sendMessage({ done: 'yes' });
	});	
}

chrome.extension.sendMessage({}, function(response) {
	chrome.storage.local.clear();
	if (document.readyState === "complete") {
		fetch(`https://${window.location.hostname}/products.json?limit=250`)
		.then((res) => res.json())
		.then((res) => parseJSONData(res.products, window.location.hostname.split('.myshopify.com')[0]))
		.catch((error) => console.warn(error));
	}
});
