var getFilterFromEvent = (event) => event.target.innerHTML;
function parseDollarValue(value){
	return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}


var backgroundPage = chrome.extension.getBackgroundPage();
function initializeStore() {
  if(localStorage.length !== 0 || backgroundPage.localStorage.length) {
    setUpTagsAndTypes();
  } else {
    setTimeout(initializeStore, 2000);
  }
}


function setUpTagsAndTypes() {
	var data = [];
	var storeName;
	for(var key in localStorage) {
		if (key !== 'storeName') {
			data.push(JSON.parse(localStorage.getItem(key)));
		} else {
			storeName = JSON.parse(localStorage.getItem(key));
		}
	}

	var types = data.reduce((total, each) => total.map((each) => each.tag).indexOf(each.product_type) === -1 ? total.concat({selected: false, tag: each.product_type }) : total, []);
	var tags = data.reduce((total, each) => {
		for (var iter = 0; iter < each.tags.length;iter++) {
			if (total.map((each) => each.tag).indexOf(each.tags[iter]) === -1) total.push({selected: false, tag: each.tags[iter] });
		}
			return total;
	}, []);

	new Vue({
		el: '#app',
		data: {
			shopifyData: data,
			tags: tags,
			types: types,
			storeName: storeName,
			tagFilter: '',
			typeFilter: ''
		},
		computed: {
			filteredShopifyData: function() {
				if (this.currentSelectedTags.length !== 0 || this.currentSelectedTypes.length !== 0) {
					return this.shopifyData.filter((each) => {
						if (this.currentSelectedTypes.indexOf(each.product_type) !== -1) {
							return true;
						}
						if (each.tags.filter((each) => this.currentSelectedTags.indexOf(each) !== -1).length) {
							return true;
						}
						return false;
					});
				}
				return this.shopifyData;
			},
			currentSelectedTags: function() {
				return this.tags.filter((each) => each.selected).map((each) => each.tag);
			},
			currentSelectedTypes: function() {
				return this.types.filter((each) => each.selected).map((each) => each.tag);
			},
			total: function() {
				var value = this.filteredShopifyData.reduce((total, each) => {
					for (let iterator = 0; iterator < each.variants.length; iterator++) {
						total += Number(each.variants[iterator].price);
					}
					return total;
				}, 0);
				return parseDollarValue(value);
			},
			numberVariants: function() {
				return this.filteredShopifyData.reduce((total, each) => {
					return total + each.variants.length
				}, 0)
			},
			numberProducts: function() {
				return this.filteredShopifyData.length;
			},
			numberTypes: function () {
				console.log(this.total);
				console.log(this.numberVariants);
				return Math.ceil(+this.total.replace(',', '') / this.numberVariants);
			}
		},
		methods: {
			toggleFilterOrTag(type, tag) {

				if (type === 'tag') {
					this.tags = this.tags.map((each) => {
						if (each.tag === tag) {
							var mutatedEach = each;
							mutatedEach.selected = !mutatedEach.selected;
							return mutatedEach;
						}
						return each;
					});
				} else if (type === 'type') {
					this.types = this.types.map((each) => {
						if (each.tag === tag) {
							var mutatedEach = each;
							mutatedEach.selected = !mutatedEach.selected;
							return mutatedEach;
						}
						return each;
					});
				}
			}
		}
	});
}

initializeStore();
