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

		Config.initialize(function() {
			
			Template.initialize();
			App.pingServer(false);
			User.initialize();
			Help.initialize();

			App.addCSS(Config.app);
			App.checkReady();

		});
		
		
	},

	checkReady: function() {
		if (Template.ready && User.ready && Help.ready) {
			if (typeof App.connected != "undefined") {
				App.onReady();
				return true;
			} else {
				App.pingServer(false);
				setTimeout(App.checkReady, Config.internalPing);
			}
		} else {
			setTimeout(App.checkReady, Config.internalPing);
		}
	},

	ready: false,
	onReady: function() {
		App.ready = true;
		if (!Config.get("tutorial")) {
			Views.render('tutorial/1');
		} else {
			Views.render('booking');
		}
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
		API.get("ping/?v="+Config.version, {
			success: function(response) {
				if (response.status == "UPDATE_REQUIRED" || response.status == "BAD_VERSION") {
					App.alert("An update required is required to continue. Please downloading it.");
					return false;
				}
				if (response.status == "UPDATE_AVAILABLE" && !App.update_alerted) {
					App.alert('An update is available to download.');
					App.update_alerted = true;
				}
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

	addCSS: function(css) {
		var file = Config.dirs.css + css + ".css";
		$('head').append('<link rel="stylesheet" type="text/css" href="'+file+'">');
	},

	alert: function(data) {
		// Placeholder function so alerts can be replaced at a later date.
		alert(data);
	},

	/* jQuery helpers */
	find : function(a) { return this.element.find(a); },
	append : function(a) { return this.element.append(a); },
	empty : function() { return this.element.empty(); },
	html : function (a) { return this.element.html(a); }

}