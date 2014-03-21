var Views = {

	current : false,
	sub: false,
	back: false,

	render: function(view, effect, params) {

		Views.back = false;

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

		// Add mobiscroll elements
		Views.mobiscroll(block);

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
			case 'token':
				return Template.render('pay/token');
			case 'cash':
				return Template.render('pay/cash');
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
				Views.back = function() {
					Views.render('booking', 'slideFromLeft', 'form');
				};
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
				$view.find("#sort-results").change(function() {
					console.log($(this).val());
					var prices = $view.find("#results").children().detach();
					switch ($(this).val()) {
					case "price":
						prices.sort(function(a, b) {
							return parseFloat($(a).attr('data-price')) - parseFloat($(b).attr('data-price'));
						});
						break;
					case "feedback":
						prices.sort(function(a, b) {
							var total_a = parseInt($(a).attr('data-no-ratings'));
							var total_b = parseInt($(b).attr('data-no-ratings'));
							var score_a = total_a ? parseFloat($(a).attr('data-rating')) : 0;
							var score_b = total_b ? parseFloat($(b).attr('data-rating')) : 0;
							if ($(a).hasClass('active') != $(b).hasClass('active')) {
								return $(a).hasClass('active') ? -1 : 1;
							} else if (score_a < score_b) {
								return 1;
							} else if (score_a > score_b) {
								return -1;
							} else if (total_a > total_b) {
								return 1;
							} else if (total_b < total_a) {
								return -1;
							} else {
								return parseFloat($(a).attr('data-price')) - parseFloat($(b).attr('data-price'));
							}
						});
						break;
					case "reliability":
						prices.sort(function(a, b) {
							if ($(a).hasClass('active') != $(b).hasClass('active')) {
								return $(a).hasClass('active') ? -1 : 1;
							} else if (parseInt($(a).attr('data-reliability')) < parseInt($(b).attr('data-reliability'))) {
								return 1;
							} else if (parseInt($(a).attr('data-reliability')) > parseInt($(b).attr('data-reliability'))) {
								return -1;
							} else {
								return parseFloat($(a).attr('data-price')) - parseFloat($(b).attr('data-price'));
							}
						});
						break;
					}
					$view.find("#results").html(prices);
				});
				$view.find("#sort-results").change();
				break;

			case 'customer':
			case 'token':
			case 'cash':
				Views.back = function() {
					Views.render('booking', 'slideFromLeft', 'quote');
				};
				$view.find("[name=name]").val(Booking.pay.data.name || User.user.name || Config.settings.name || "");
				$view.find("[name=email]").val(Booking.pay.data.email || User.user.email || Config.settings.email || "");
				$view.find("[name=telephone]").val(Booking.pay.data.telephone || User.user.phone || Config.settings.telephone || "");
				break;

			case 'card':
				Views.back = function() {
					Views.render('booking', 'slideFromLeft', 'customer');
				};
				$view.find("[name=card_type]").val(Booking.pay.data.card_type || (DevMode ? 'DELTA' : false) || "");
				$view.find("[name=card_number]").val(Booking.pay.data.card_number || (DevMode ? '4462000000000003' : false) || "");
				$view.find("[name=card_start]").val(Booking.pay.data.card_start || new Date(new Date().getTime()-1000*60*60*24*365).format("m/Y"));
				$view.find("[name=card_expiry]").val(Booking.pay.data.card_expiry || (DevMode ? '12/2014' : false) || new Date(new Date().getTime()+1000*60*60*24*365).format("m/Y"));
				$view.find("[name=issue_number]").val(Booking.pay.data.issue_number || "");
				$view.find("[name=CV2]").val(Booking.pay.data.CV2 || (DevMode ? '123' : false) || "");
				if (typeof Booking.pay.data.save == "boolean" ? Booking.pay.data.save : true) {
					$view.find("[name=save]").attr("checked", "checked");
				} else {
					$view.find("[name=save]").removeAttr("checked");
				}
				var maestro = function() {
					$view.find(".maestro-field").toggle($(this).val() == "MAESTRO");
				};
				$view.find("[name=card_type]").each(maestro).change(maestro);
				break;

			case 'billing':
				Views.back = function() {
					Views.render('booking', 'slideFromLeft', 'card');
				};

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
				
			case 'quote':
				Views.back = function() {
					Views.render('booking', 'slideFromLeft', 'results');
				};
				break;

			case 'form':
			default:
				// Save and load
				$view.find("[name]").each(function() {
					// Get value
					var val = Booking.data[$(this).attr('name')];
					// If it is a date in YYYY-MM-DD Format, convert it to DD/MM/YYYY
					if (val.match && val.match(/^[0-9][0-9][0-9][0-9]\-[0-9][0-9]\-[0-9][0-9]$/g)) {
						val = val.substr(8, 2) + "/" + val.substr(5, 2) + "/" + val.substr(0, 4);
					}
					// Assign value
					$(this).val(val);
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

			Views.back = function() {
				Views.render('account', 'slideFromLeft');
			};

			switch (mode) {
				case 'create':
					return Template.render('account/create');
				case 'verify':
					return Template.render('account/verify');
				case 'card':
					return Template.render('account/cards');
				case 'password':
					return Template.render('account/password');
			}
			Views.back = false; // No mode set
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
				return Template.render('account/login', mode && mode.email ? {email: mode.email} : {});
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
			Views.render('account', 'slide', 'create');
		});

		$view.find("[data-action=verify]").click(function() {
			Views.render('account', 'slide', 'verify');
		});

		$view.find("[data-action=card]").click(function() {
			Views.render('account', 'slide', 'card');
		});

		$view.find("[data-action=password]").click(function() {
			Views.render('account', 'slide', 'password');
		});

	},

	renderBookings: function($view, details) {
		if (typeof details == "undefined") {
			return Template.render('bookings');
		} else {
			Views.back = function() {
				Views.render('bookings', 'slideFromLeft');
			};
			return Template.render('booking/details', {booking: details});
		}
	},

	setupBookings: function($views, details) {
		$views.find(".resend-booking").click(function() {
			App.loading();
			API.get("booking/resend", {
				data: $.extend({reference: details.reference}, User.authObject()),
				success: function(response) {
					App.stopLoading();
					if (response.status == "OK") {
						App.alert("You should recieve an email from us shortly to the email address the booking was made from. If you don't please check your spam folder.", {title: "Receipt Sent"})
					} else {
						App.alert("Failed to resend reciept, please try again later.", {title: "Uh oh!"});
					}
				},
				failure: function() {
					App.stopLoading();
					App.alert("Failed to resend reciept, please try again later.", {title: "Uh oh!"});
				}
			});
		});
	},

	renderHelp: function($view) {
		return Template.render('help');
	},

	console: function() {
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
	},

	mobiscroll: function($view) {
		var options = {
			theme: Config.theme ? Config.theme : 'ios7',
			display: 'bottom',
		};
		$view.find("[data-type=date]").scroller('destroy').scroller($.extend({
			preset: 'date',
			dateFormat: 'dd/mm/yy',
			dateOrder: 'ddMyy',
			minDate: new Date(),
			maxDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 2)
		}, options));
		$view.find("[data-type=time]").scroller('destroy').scroller($.extend({
			preset: 'time',
			timeFormat: 'HH:ii',
			timeWheels: 'HHii',
			stepMinute: 5
		}, options));
		$view.find("[data-type=month]").each(function() {
			$(this).scroller('destroy').scroller($.extend({
				preset: 'date',
				dateOrder: 'MMyy',
				dateFormat: 'mm/yy',
				minDate: $(this).is("[data-date-min]") ? new Date(parseInt($(this).attr('data-date-min'))) : undefined,
				maxDate: $(this).is("[data-date-max]") ? new Date(parseInt($(this).attr('data-date-max'))) : undefined
			}, options));
			console.log($(this), $.extend({
				preset: 'date',
				dateOrder: 'MMyy',
				dateFormat: 'mm/yy',
				minDate: $(this).is("[data-date-min]") ? new Date(parseInt($(this).attr('data-date-min'))) : undefined,
				maxDate: $(this).is("[data-date-max]") ? new Date(parseInt($(this).attr('data-date-max'))) : undefined
			}, options));
		});
		$view.find("[data-type=datetime]").scroller('destroy').scroller($.extend({
			preset: 'datetime',
			minDate: new Date(),
			maxDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
			stepMinute: 5
		}, options));
		$view.find("select").scroller('destroy').scroller($.extend({
			preset: 'select'
		}, options));
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

		$("#main").animate({scrollTop: 0}, duration);
		$("#app2").animate({left: 0}, {duration: duration, queue: false});
		$("#app").animate({left: -shift}, {duration: duration, queue: false, complete: function() {
			$("#app").css({left: 0}).empty().append($("#app2").children());
			$("#app2").remove();
		}});

	}
}
