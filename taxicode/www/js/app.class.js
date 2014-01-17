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

		$("[data-render]").click(function() {

			var render = $(this).attr('data-render');

			$("[data-render]").removeClass('selected');
			$("[data-render='" + render + "']").addClass('selected');

			Views.render(render, 'slide');

		});

		Views.render('booking2');
		
	},

	/* jQuery helpers */
	find : function(a) { return this.element.find(a); },
	append : function(a) { return this.element.append(a); },
	empty : function() { return this.element.empty(); },
	html : function (a) { return this.element.html(a); }

}