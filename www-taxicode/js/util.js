Date.prototype.format = function(format, offset) {

	offset = offset == false ? 0 : this.getTimezoneOffset() * 60000;
	var $this = new Date(this.getTime() + offset);

	format = format ? format : "Y-m-d";

	var year = $this.getFullYear();

	var month = $this.getMonth() + 1;
	var month_pad = month < 10 ? "0" + month : month;

	var date = $this.getDate();
	var date_pad = date < 10 ? "0" + date : date;

	var hours = $this.getHours();
	var hours_pad = hours < 10 ? "0" + hours : hours;

	var day = $this.getDay();

	var date_suffix = date == 1 ? "st" : (date == 2 ? "nd" : (date == 3 ? "rd" : "th"));

	var hours12 = hours > 12 ? hours - 12 : hours;
	var hours12_pad = hours12 < 10 ? "0" + hours12 : hours12;

	var mins = $this.getMinutes();
	var mins_pad = mins < 10 ? "0" + mins : mins;

	var secs = $this.getSeconds();
	var secs_pad = secs < 10 ? "0" + secs : secs;

	var millisecs = $this.getMilliseconds();
	var millisecs_pad = millisecs < 10 ? "000" + millisecs : (millisecs < 100 ? "00" + millisecs : "0" + millisecs);

	var ampm = hours < 12 ? "am" : "pm";

	var months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];	
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	var days_short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	var escape = false;
	return $.map(format.split(""), function(character) {
		if (escape) {
			escape = false;
			return character; // Character was preceded by \ so it is being escaped.
		}
		switch (character) {

			// Special Escape Character
			case "\\": escape = true; return "";

			// Year
			case "Y": return year; // Year - Example: 2014
			case "y": return year % 100;

			// Month
			case "n": return month; // Months 0 - 12
			case "m": return month_pad; // Months 00 - 12
			case "M": return months_short[month - 1]; // Jan - Dec
			case "F": return months[month - 1]; // January - December

			// Date
			case "j": return date; // Date 00 - 31
			case "d": return date_pad; // Date 00 - 31
			case "S": return date_suffix; // Date st, nd, rd, th

			// Day
			case "w": return day; // 0 = Sunday ... 6 = Saturday
			case "N": return day ? day : 7; // 1 = Monday ... 7 = Sunday
			case "l": return days[day]; // Monday - Sunday
			case "D": return days_short[day]; // Mon - Sun

			// Hours
			case "G": return hours; // Hours 0 - 23
			case "g": return hours12; // Hours 0 - 12
			case "H": return hours_pad; // Hours 00 - 23
			case "h": return hours12_pad; // Hours 00 - 12
			case "a": return ampm; // am or pm
			case "A": return ampm.toUpperCase(); // AM or PM

			// Minutes and seconds
			case "i": return mins_pad; // Minutes 00 - 59
			case "s": return secs_pad; // Seconds 00 - 59

			case "u": return millisecs+"0000"; // Micro seconds
			case "U": return Math.floor($this.getTime()/1000); // Micro seconds

			// Not special date character
			default: return character;

		}
	}).join("");

};

Date.prototype.formatTime = function() {
	return this.format("H:i:s");
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

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/gm, '');
	};
}

$.visible = function(e) {
	return $(e).is(":visible");
};

function addConsole() {
	$("#footer a[data-render='console']").show();
	$("#footer a").css({width: '20%'});
	DevMode = true;
}

$(document).ready(function() {
	if (DevMode) {
		addConsole();
	}
});
