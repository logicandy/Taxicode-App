/**
 * Fake phonegap.js file to help for browser testing.
 * This will be replaced with a platform specific JS file when compiled.
 */

var StatusBar;

$(document).ready(function() {

	// Device Ready event
	var ready = document.createEvent("HTMLEvents");
	ready.initEvent("deviceready", true, true);
	document.dispatchEvent(ready);

	// Add StatusBar
	StatusBar = $("<div id='StatusBar'></div>");
	StatusBar.styleLightContent = StatusBar.overlaysWebView = function() {};
	$("body").append(StatusBar);

});