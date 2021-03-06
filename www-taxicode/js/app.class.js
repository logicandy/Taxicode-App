var App = {

	element : $("#app"),

	connected : undefined,

	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {

		if (typeof StatusBar != "undefined") {
			StatusBar.overlaysWebView(false);
		}

		if (typeof FastClick != "undefined") {
			FastClick.attach(document.body);
		}

		// Startup
		App.loading("Loading App Data");
		App.start_time = new Date().getTime();
		Libs.initialize();
		Config.initialize(function() {
			Template.initialize();
			App.pingServer(false);
			User.initialize();
			Help.initialize();

			App.addCSS(Config.app);
			if (Config.demo) {
				App.addCSS("demo");
			}
			App.checkReady();
		});
		
		
	},

	checkReady: function() {
		if (new Date().getTime() - App.start_time > 1000 * 60) {
			// If 1 minute has passed, restart entire app.
			App.restart();
		}
		if (Template.ready && User.ready && Help.ready && Libs.ready) {
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

	restart: function() {
		window.location.href = window.location.href;
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
		Analytics.setup();
		App.stopLoading();
		App.optionButton();
	},

	loading: function(text) {

		$("#page-loading").remove();
		$("body").append("<div id='page-loading'><div class='loader'><div></div></div></div>");

		if (text) {
			App.setLoadingText(text);
		}

	},

	setLoadingText: function(text) {
		var loader = $("#page-loading .loader").css({height: 'auto'});
		loader.find(".loading-text").remove();
		loader.append("<span class='loading-text'>" + text + "</span>");
		$("#page-loading").height(windowHeight);
	},

	stopLoading: function() {
		$("#page-loading").remove();
	},

	pingServer: function(callback) {
		callback = callback ? callback : function() {};
		API.get("ping/?v="+Config.version, {
			success: function(response) {
				if ((response.status == "UPDATE_REQUIRED" || response.status == "BAD_VERSION") && !App.update_alerted) {
					App.alert("An important update is required to continue. Please download it.",{title:"Important",options:{}});
					App.update_alerted = true;
					return false;
				}
				if (response.status == "UPDATE_AVAILABLE" && !App.update_alerted) {
					var alert = App.alert('An update is available to download.<br/>Please update in the App Store.',{
						// options: {
						// 	Cancel: function() {
						// 		$(this).closest(".alert").remove();
						// 	},
						// 	Update: function() {
						// 		$(this).attr({
						// 			"href": ,
						// 			"target": "_blank"
						// 		});
						// 	}
						// }
				});
					App.update_alerted = true;
				}
				callback();
				App.online();
			},
			failure: function() {
				callback();
				App.offline();
			}
		}, 0);
	},

	pingRepeat: function() {
		App.pingServer();
		setTimeout(App.pingRepeat, Config.externalPing);
	},

	connected_initial: false,
	online: function() {
		App.connected_initial = true;
		$("body").attr("data-status", "online");
		$("#offline, #offline-warning").remove();
		App.connected = true;
	},

	offline: function() {
		$("body").attr("data-status", "offline");
		$("#offline, #offline-warning").remove();
		if (App.ready && App.connected_initial) {
			$("body").append(Template.render('offline/alert'));
		} else {
			$("body").append(Template.render('offline/screen'));
		}
		App.connected = false;
	},

	addCSS: function(css) {
		var file = Config.dirs.css + css + ".css";
		$('head').find("link[href='"+file+"']").remove();
		$('head').append('<link rel="stylesheet" type="text/css" href="'+file+'">');
	},

	/* System alert box function */
	alert: function(data, settings) {

		// Default settings - no title - one button that says OK and closes window
		settings = $.extend({
			options: {OK: function() {
				$(this).closest('.alert').remove();
			}},
			title: false,
			prompt: false,
			bodyStyle: false,
			id: ""
		}, settings);

		// Create alert box HTML with a template
		var alert = Template.render('alert', {
			title: settings.title,
			data: data,
			options: $.map(settings.options, function(e, i) { return i; }),
			prompt: settings.prompt,
			id: settings.id
		});

		// Add functionality to the alert buttons
		$.each(settings.options, function(key, func) {
			alert.find(".option[data-id='"+key+"']").click(func);
		});

		// Add prompt input field
		if (settings.prompt) {
			alert.find("input.prompt").keypress(function(e) {
				if (e.keyCode == 13) {
					settings.prompt(this);
				}
			});
		}

		// Add body style
		if (settings.bodyStyle) {
			alert.find(".body").css(settings.bodyStyle);
		}

		// Add the page
		$("body").append(alert);

		// Focus on new element
		if (settings.prompt) {
			alert.find("input.prompt").focus();
		} else if (alert.find(".option").length == 1) {
			alert.find(".option").focus();
		}

		// Returns alert
		return alert;
	},

	confirm: function(data, callback) {
		callback = typeof callback == "function" ? callback : function() {};
		return App.alert(data, {options: {
			Cancel : function() {
				$(this).closest('.alert').remove();
				callback(false);
			},
			OK : function() {
				$(this).closest('.alert').remove();
				callback(true);
			}
		}});
	},

	prompt: function(data, callback) {
		callback = typeof callback == "function" ? callback : function() {};
		return App.alert(data, {
			prompt: function(element) {
				var val = $(element).val();
				$(element).closest('.alert').remove();
				callback(val);
			},
			options: {
				Cancel : function() {
					$(this).closest('.alert').remove();
					callback(null);
				},
				OK : function() {
					var val = $(this).closest('.alert').find("input.prompt").val();
					$(this).closest('.alert').remove();
					callback(val);
				},
			}
		});
	},

	optionButton: function() {
		if (typeof Views.back == "function") {
			$("#header").addClass("option");
			$("#header .option-button").html(Views.back_text ? Views.back_text : "Back");
		} else if (!User.user && Views.current != "account") {
			$("#header").addClass("option");
			$("#header .option-button").html("Sign In");
		} else if (User.user && Views.current == "account") {
			$("#header").addClass("option");
			$("#header .option-button").html("Sign Out");
		} else {
			$("#header").removeClass("option");
		}
		setTimeout(App.optionButton, Config.internalPing);
	},

	optionButtonClick: function() {
		if (typeof Views.back == "function") {
			Views.back();
		} else if (User.user && Views.current == "account") {
			User.logout();
		}  else if (!User.user && Views.current != "account") {
			Views.render("account");
		}
	},

	/* Array of tooltips. Shuffled accept first element. */
	tooltips: [Config.title + " works best for all your medium and long distance bookings."].concat($([
		"Creating an account will speed up your booking process in the future.",
		"You need to book a minimum of 1 hour in advance with " + Config.title + ".",
		"Our taxi network is great for all airport transfers and holiday pickups.",
		"Business customers can create a business account to manage bookings"
	]).sort(function() {
    	return Math.random() > Math.random();
	}).toArray()),

	/* jQuery helpers */
	find : function(a) { return App.element.find(a); },
	append : function(a) { return App.element.append(a); },
	empty : function() { return App.element.empty(); },
	html : function (a) { return App.element.html(a); }

}