Date.prototype.format = function() {

	var year = this.getFullYear();

	var month = new Date().getMonth()+1;
	month = month < 10 ? "0"+month : month;

	var date = new Date().getDate();
	date = date < 10 ? "0"+date : date;

	return year+"-"+month+"-"+date;
	
}

function ucwords(str) {
	return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
		return $1.toUpperCase();
	});
}