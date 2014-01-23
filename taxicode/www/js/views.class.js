var Views = {

	current : false,

	render: function(view, effect) {

		window.location.hash = view;
		this.current = view;

		// Get view
		if (view == "console") {
			this.console();
			return false;
		} else if (typeof this["render"+ucwords(view)] == "function") {
			var block = this["render"+ucwords(view)]($("<div class='view'></div>"))
		} else {
			alert("View doesn't exist: '"+view+"'");
			return false;
		}

		// Setup interactivity
		if (typeof this["setup"+ucwords(view)] == "function") {
			this["setup"+ucwords(view)](block);
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

	renderBooking : function($view) {

		$view.append("<div class='field'><input type='text' placeholder='Pickup' data-var='pickup' /></div>");
		$view.append("<div class='field'><input type='text' placeholder='Destination' data-var='destination' /></div>");
		$view.append("<div class='field'><input type='text' placeholder='Vias - Optional' data-var='vias' /></div>");

		$view.append("<div class='field'></div>");
		$view.find(".field:last")
			.append("<input type='date' data-var='pickupDate' min='"+(new Date().format())+"' />")
			.append("<input type='time' data-var='pickupTime' />");

		$view.append("<div class='field'><select data-var='passengers'></select></div>");
		for (var i = 1; i <= 30; i++) {
			$view.find(".field:last select").append("<option value='"+i+"'>"+i+" Passenger"+(i>1?"s":"")+"</option>");
		}

		$view.append("<br/><div class='field'><a class='btn'>Get Quote</a></div>");

		return $view;

	},

	renderBooking2 : function($view) {

		var block = $("<div class='block'><h2>Journey</h2></div>");

		var fieldset = $("<div class='fieldset'></div>");
		fieldset.append("<div class='field'><label>Pickup</label><input type='text' data-var='pickup' maxlength='100' /></div>");
		fieldset.append("<div class='field'><label>Destination</label><input type='text' data-var='destination' maxlength='100' /></div>");
		// fieldset.append("<div class='field'><label>Via</label><input type='text' placeholder='Optional' data-var='vias' maxlength='100' /></div>");
		block.append(fieldset);

		block.append("<input type='date' data-var='pickupDate' min='"+(new Date().format())+"' />");
		block.append("<input type='time' data-var='pickupTime' />");

		block.append("<select data-var='passengers'></select>");
		for (var i = 1; i <= 30; i++) {
			block.find("select:last").append("<option value='"+i+"'>"+i+" Passenger"+(i>1?"s":"")+"</option>");
		}

		block.append("<a class='btn' onclick='Booking.getQuote();'>Get Quote</a>");

		return $view.append(block);
	},

	setupBooking : function($view) {
		// Save and load
		$view.find("[data-var]").each(function() {
			var key = $(this).attr('data-var');
			$(this).val(Booking[key]);
		});
		$view.find("[data-var]").change(function() {
			var key = $(this).attr('data-var');
			Booking[key] = $(this).val();
		});

		// Autocomplete
		if (typeof google == "object") {
			$view.find("[data-var=pickup], [data-var=destination], [data-var=vias]").each(function() {
				var ac = new google.maps.places.Autocomplete(this, {componentRestrictions: {country: Config.country_code}});
			});
		}
	},

	setupBooking2 : function ($view) {
		this.setupBooking($view);
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

		panel.attr({id: 'app2'}).css({left: shift, top: -App.element.offset().top-height});

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
