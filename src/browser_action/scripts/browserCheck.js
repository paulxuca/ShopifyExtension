window.onload = () => {
	if (!window.shopifyData) {
		document.querySelector('#hideOnNoData').style.display = 'none';
		document.querySelector('#noDataInformation').style.display = 'flex';
	} else {
		document.querySelector('#hideOnNoData').style.display = 'flex';
		document.querySelector('#noDataInformation').style.display = 'none';
	}
}
