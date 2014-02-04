Date.prototype.format = function() {

	var year = this.getFullYear();

	var month = new Date().getMonth()+1;
	month = month < 10 ? "0"+month : month;

	var date = new Date().getDate();
	date = date < 10 ? "0"+date : date;
	
	return year+"-"+month+"-"+date;
};

Date.prototype.formatTime = function() {

	var hours = this.getHours();
	var mins = new Date().getMinutes();
	var secs = new Date().getSeconds();

	return (hours < 10 ? "0"+hours : hours) + ":" + (mins < 10 ? "0"+mins : mins) + ":" + (secs < 10 ? "0"+secs : secs);
}

Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
};

function ucwords(str) {
	return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
		return $1.toUpperCase();
	});
}

$.jsonp