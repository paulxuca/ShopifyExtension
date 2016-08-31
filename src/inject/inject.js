function parseJSONData(data) {
	for (var iter = 0; iter < data.length; iter++) {
		localStorage.setItem(data[iter].id, JSON.stringify(data[iter]));
	}
}

chrome.extension.sendMessage({}, function(response) {
	localStorage.clear();
	if (document.readyState === "complete") {
		fetch(`https://${window.location.hostname}/products.json?limit=250`)
		.then((res) => res.json())
		.then((res) => parseJSONData(res.products))
		.catch((error) => console.warn(error));
	}
});
