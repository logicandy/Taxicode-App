var App = {

	element : $("#app"),

	connected : undefined,

	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {

		if (typeof StatusBar != "undefined") {
			StatusBar.styleLightContent();
			StatusBar.overlaysWebView();
		}

		// Startup

		App.loading();

		Template.initialize();
		App.pingServer(false);
		User.initialize();

		App.checkReady();

		
	},

	checkReady: function() {
		if (Template.ready && User.ready && App.connected != "undefined") {
			App.onReady();
		} else {
			setTimeout(App.checkReady, Config.internalPing);
		}
	},

	ready: false,
	onReady: function() {
		App.ready = true;
		Views.render('booking2');
		if (App.connected) {
			API.getKey();
		} else {
			App.offline();
		}
		setTimeout(App.pingRepeat, Config.externalPing);
		App.stopLoading();
	},

	loading: function() {
		$("#page-loading").remove();
		$("body").append("<div id='page-loading'><div class='loader'><div></div></div></div>");
	},

	stopLoading: function() {
		$("#page-loading").remove();
	},

	pingServer: function(callback, renderOfflineWindow) {
		callback = callback ? callback : function() {};
		API.get("ping", {
			success: function() {
				callback();
				App.online();
			},
			failure: function() {
				callback();
				App.offline(typeof renderOfflineWindow == "undefined" ? true : renderOfflineWindow);
			}
		}, 0);
	},

	pingRepeat: function() {
		App.pingServer();
		setTimeout(App.pingRepeat, Config.externalPing);
	},

	online: function() {
		$("#offline").remove();
		App.connected = true;
	},

	offline: function(renderWindow) {
		if (renderWindow) {
			$("#offline").remove();
			$("body").append(Template.render('offline'));
		}
		App.connected = false;
	},

	/* jQuery helpers */
	find : function(a) { return this.element.find(a); },
	append : function(a) { return this.element.append(a); },
	empty : function() { return this.element.empty(); },
	html : function (a) { return this.element.html(a); }

}