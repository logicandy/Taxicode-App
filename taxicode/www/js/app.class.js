var App = {

	element : $("#app"),

	country : 'United Kingdom',
	country_code : 'gb',

	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {

		var $this = this;

		if (typeof StatusBar != "undefined") {
			StatusBar.styleLightContent();
			StatusBar.overlaysWebView();
		}

		API.getKey();

		User.initialize();

		// Views.render(window.location.hash?window.location.hash.substr(1):'booking2');
		Views.render('booking2');
		
	},

	loading: function() {
		$("#page-loading").remove();
		$("body").append("<div id='page-loading'><div class='loader'><div></div></div></div>");
	},

	stopLoading: function() {
		$("#page-loading").remove();
	},

	/* jQuery helpers */
	find : function(a) { return this.element.find(a); },
	append : function(a) { return this.element.append(a); },
	empty : function() { return this.element.empty(); },
	html : function (a) { return this.element.html(a); }

}