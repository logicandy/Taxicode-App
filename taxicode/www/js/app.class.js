var App = {

	element : $("#app"),


	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady : function() {

		var $this = this;

		if (typeof StatusBar != "undefined") {
			StatusBar.styleLightContent();
			StatusBar.overlaysWebView();
		}

		Views.render(window.location.hash?window.location.hash.substr(1):'booking2');
		
	},

	/* jQuery helpers */
	find : function(a) { return this.element.find(a); },
	append : function(a) { return this.element.append(a); },
	empty : function() { return this.element.empty(); },
	html : function (a) { return this.element.html(a); }

}