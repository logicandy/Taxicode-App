Date.prototype.format = function() {

	var year = this.getFullYear();

	var month = new Date().getMonth()+1;
	month = month < 10 ? "0"+month : month;

	var date = new Date().getDate();
	date = date < 10 ? "0"+date : date;

	return year+"-"+month+"-"+date;
	
}
