var Views = {

	current : false,

	render: function(view, effect, params) {

		//window.location.hash = view;
		this.current = view;

		// Get view
		if (view == "console") {
			this.console();
			return false;
		} else if (typeof this["render"+ucwords(view)] == "function") {
			var block = this["render"+ucwords(view)]($("<div class='view'></div>"), params?params:undefined);
		} else if (typeof Template.templates[view] != "undefined") {
			var block = Template.render(view);
		} else {
			App.alert("View doesn't exist: '"+view+"'");
			return false;
		}

		// Setup interactivity
		if (typeof this["setup"+ucwords(view)] == "function") {
			this["setup"+ucwords(view)](block, params?params:undefined);
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

		switch (mode) {
			case 'results':
				return Template.render('booking/results', Booking.quotes);
			case 'quote':
				return Template.render('booking/quote', {
					journey: Booking.journey,
					quote: Booking.quotes[Booking.quote]
				});
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
		switch (mode) {
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
			case 'form':
			default:
				
				// Save and load
				$view.find("[data-var]").each(function() {
					$(this).val(Booking.data[$(this).attr('data-var')]);
				});
				$view.find("[data-var]").change(function() {
					Booking.data[$(this).attr('data-var')] = $(this).val();
				});

				// Autocomplete
				if (typeof google == "object") {
					$view.find("[data-var=pickup], [data-var=destination], [data-var=vias]").each(function() {
						var ac = new google.maps.places.Autocomplete(this, {componentRestrictions: {country: Config.country_code}});
					});
				}

				break;
		}
	},

	renderAccount : function($view) {
		
		$view.append("<h1>Account Page</h1>");

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

	},

	renderBookings : function($view) {
		$view.append("<div class='block'><h2>Bookings</h2></div>");
		return $view;
	},

	renderHelp : function($view) {
		return Template.render('help');
	},

	console : function() {
		if ($(".console").length) {
			$(".console").remove();
			$("#header > *").show();
		} else {
			$("#header > *").hide();
			$("#header").append("<div class='console'><input type='text' autocapitalize='off' autocorrect='off' /></div>");
		}
	}

};

var ViewAnimation = {
	slide : function (panel, d) {

		var shift = $(document).width() * d;
		var height = App.element.height();

		var panel = $("<div></div>").append(panel).attr({id: 'app2'}).css({left: shift, top: -App.element.offset().top-height});

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
