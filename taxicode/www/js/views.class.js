var Views = {

	current : false,
	sub: false,

	render: function(view, effect, params) {

		// Get view
		if (view == "console") {
			this.console();
			return false;
		} else if (typeof this["render"+ucwords(view)] == "function") {
			var block = this["render"+ucwords(view)]($("<div class='view'></div>"), params);
		} else if (typeof Template.templates[view] != "undefined") {
			var block = Template.render(view);
		} else {
			App.alert("View doesn't exist: '"+view+"'");
			return false;
		}

		// Set current view
		Views.current = view;
		Views.sub = false;

		// Setup interactivity
		if (typeof this["setup"+ucwords(view)] == "function") {
			this["setup"+ucwords(view)](block, params);
		}

		// Transition
		switch (effect) {
			case 'slide':
			case 'slideFromRight':
				ViewAnimation.slide(block, +1);
				break;
			case 'slideFromLeft':
				ViewAnimation.slide(block, -1);
				break;
			case 'swap':
			default:
				App.empty().append(block);
				break;
		}

	},

	refresh: function() {
		this.render(this.current);
	},

	renderBooking : function($view, mode) {

		mode = mode ? mode : Booking.state;
		Views.sub = mode;

		switch (mode) {
			case 'results':
				return Template.render('booking/results', Booking.quotes);
			case 'quote':
				return Template.render('booking/quote', {
					journey: Booking.journey,
					quote: Booking.quotes[Booking.quote]
				});
			case 'customer':
				return Template.render('pay/customer');
			case 'card':
				return Template.render('pay/card');
			case 'billing':
				return Template.render('pay/billing');
			case 'complete':
				return Template.render('booking/complete');
			case 'form':
			default:
				var passengers = {};
				for (var i = 1; i <= 30; i++) {
					passengers[i] = i > 1 ? i + " Passengers" : "1 Passenger";
				}
				return Template.render('booking', {passengers: passengers});
		}
		
	},

	setupBooking : function($view, mode) {

		Booking.state = mode ? mode : Booking.state;

		switch (Booking.state) {
			case 'results':
				$view.find(".rating").each(function() {
					var ratings = parseInt($(this).attr("data-ratings"));
					if (ratings) {
						var score = Math.floor(parseFloat($(this).attr("data-score")));
						$(this).empty();

						for (var i = 0; i < score; i++) {
							$(this).append("<img src='img/star_red.png' />");
						}
						for (var i = 0; i < 5-score; i++) {
							$(this).append("<img src='img/star_grey.png' />");
						}

						$(this).append("<span>("+ratings+")</span>");
					} else {
						$(this).html("No Ratings");
					}
				});
				break;

			case 'customer':
				$view.find("[name=name]").val(Booking.pay.data.name || User.user.name || Config.settings.name || "");
				$view.find("[name=email]").val(Booking.pay.data.email || User.user.email || Config.settings.email || "");
				$view.find("[name=telephone]").val(Booking.pay.data.telephone || User.user.phone || Config.settings.telephone || "");
				break;

			case 'card':
				$view.find("[name=card_type]").val(Booking.pay.data.card_type || "");
				$view.find("[name=card_number]").val(Booking.pay.data.card_number || "");
				$view.find("[name=card_start]").val(Booking.pay.data.card_start || "");
				$view.find("[name=card_expiry]").val(Booking.pay.data.card_expiry || "");
				$view.find("[name=issue_number]").val(Booking.pay.data.issue_number || "");
				$view.find("[name=CV2]").val(Booking.pay.data.CV2 || "");
				var maestro = function() {
					$view.find(".maestro-field").toggle($(this).val() == "MAESTRO");
				};
				$view.find("[name=card_type]").each(maestro).change(maestro);
				break;

			case 'billing':

				// Check if we can use names from elsewhere (if they're both less than 20 chars)
				var first_name = User.user.first_name || Config.settings.first_name || "";
				var last_name = User.user.last_name || Config.settings.last_name || "";
				if (first_name.length > 20 || last_name.length > 20) {
					first_name = last_name = "";
				}

				$view.find("[name=billing_first_name]").val(Booking.pay.data.billing_first_name || Config.settings.billing_first_name || first_name);
				$view.find("[name=billing_surname]").val(Booking.pay.data.billing_surname || Config.settings.billing_surname || last_name);
				$view.find("[name=billing_address_1]").val(Booking.pay.data.billing_address_1 || Config.settings.billing_address_1 || "");
				$view.find("[name=billing_address_2]").val(Booking.pay.data.billing_address_2 || Config.settings.billing_address2 || "");
				$view.find("[name=billing_city]").val(Booking.pay.data.billing_city || Config.settings.billing_city || "");
				$view.find("[name=billing_postcode]").val(Booking.pay.data.billing_postcode || Config.settings.billing_postcode || "");
				$view.find("[name=billing_country]").val(Booking.pay.data.billing_country || Config.settings.billing_country || "");
				$view.find("[name=billing_state]").val(Booking.pay.data.billing_state || Config.settings.billing_state || "");
				var us = function() {
					$view.find(".us-field").toggle($(this).val() == "US");
				};
				$view.find("[name=billing_country]").each(us).change(us);
				break;

			case 'form':
			default:
				// Save and load
				$view.find("[name]").each(function() {
					$(this).val(Booking.data[$(this).attr('name')]);
				});
				$view.find("[name]").change(function() {
					Booking.data[$(this).attr('name')] = $(this).val();
				});
				// Autocomplete
				if (window.google && window.google.maps && window.google.maps.places) {
					$view.find("[name=pickup], [name=destination], [name=vias]").each(function() {
						var ac = new google.maps.places.Autocomplete(this, {componentRestrictions: {country: Config.country_code}});
					});
				}
				break;
		}
	},

	renderAccount : function($view, mode) {
		
		$view.append("<h1>Account Page</h1>");

		if (mode) {
			switch (mode) {
				case 'create':
					return Template.render('account/create');
					return;
				case 'verify':
					return Template.render('account/verify');
					return;
			}
		}

		switch (User.state) {
			case "loading":
				var block = $("<div class='block padded'><img src='img/loading.gif' /></div>");
				App.loading();
				$view.append(block);
				break;
			case true:
				return Template.render('account/user', User.user);
			case false:
				return Template.render('account/login');
		}
		return $view;
	},

	setupAccount : function($view) {

		$view.find("[data-action=login]").click(function() {
			User.login($view.find("[type=email]").val(), $view.find("[type=password]").val());
		});

		$view.find("[data-action=logout]").click(function() {
			User.logout();
		});

		$view.find("[data-action=create]").click(function() {
			Views.render('account', undefined, 'create');
		});

		$view.find("[data-action=verify]").click(function() {
			Views.render('account', undefined, 'verify');
		});

	},

	renderBookings : function($view, details) {
		if (typeof details == "undefined") {
			return Template.render('bookings');
		} else {
			return Template.render('booking/details', {booking: details});
		}
	},

	renderHelp : function($view) {
		return Template.render('help');
	},

	console : function() {
		App.alert("<div class='console'><input type='text' autocapitalize='off' autocorrect='off' style='width: 255px;'/></div>", {
			title: "Console",
			options: {
				Cancel: function() {
					$(this).closest(".alert").remove();
				},
				Execute: function() {
					$(this).closest(".alert").find(".console input").change();
				}
			}
		});
	}

};

var ViewAnimation = {
	offset: parseInt(App.element.css('marginTop')),
	slide : function (panel, d) {

		var shift = $(document).width() * d;
		var height = App.element.height();

		var panel = $("<div class='view'></div>").append(panel).attr({id: 'app2'}).css({left: shift, top: -height-ViewAnimation.offset});

		var duration = 600;
		$("#app").after(panel);

		$("body").animate({scrollTop: 0}, duration);
		$("#app2").animate({left: 0}, {duration: duration, queue: false});
		$("#app").animate({left: -shift}, {duration: duration, queue: false, complete: function() {
			$("#app").css({left: 0}).empty().append($("#app2").children());
			$("#app2").remove();
		}});

	}
}
