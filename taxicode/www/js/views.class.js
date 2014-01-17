var Views = {

	render: function(view, effect) {

		if (view == "console") {
			this.console();
			return false;
		} else if (typeof this["render"+ucwords(view)] == "function") {
			view = this["render"+ucwords(view)]($("<div class='view'></div>"))
		} else {
			alert("View doesn't exist: '"+view+"'");
			return false;
		}

		switch (effect) {
			case 'slide':
			case 'slideFromRight':
				ViewAnimation.slide(view, +1);
				break;
			case 'slideFromLeft':
				ViewAnimation.slide(view, -1);
				break;
			case 'swap':
			default:
				App.empty().append(view);
				break;
		}


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

		$view.find("[data-var]").each(function() {
			var key = $(this).attr('data-var');
			$(this).val(Booking[key]);
		});

		$view.find("[data-var]").change(function() {
			var key = $(this).attr('data-var');
			Booking[key] = $(this).val();
		});

		return $view;

	},

	renderBooking2 : function($view) {

		var block = $("<div class='block'><h2>Journey</h2></div>");

		var fieldset = $("<div class='fieldset'></div>");
		fieldset.append("<div class='field'><label>Pickup</label><input type='text' data-var='pickup' /></div>");
		fieldset.append("<div class='field'><label>Via</label><input type='text' data-var='destination' /></div>");
		fieldset.append("<div class='field'><label>Destination</label><input type='text' placeholder='Optional' data-var='vias' /></div>");
		block.append(fieldset);

		block.append("<input type='date' data-var='pickupDate' min='"+(new Date().format())+"' />");
		block.append("<input type='time' data-var='pickupTime' />");

		block.append("<select data-var='passengers'></select>");
		for (var i = 1; i <= 30; i++) {
			block.find("select:last").append("<option value='"+i+"'>"+i+" Passenger"+(i>1?"s":"")+"</option>");
		}

		block.append("<a class='btn'>Get Quote</a>");

		block.find("[data-var]").each(function() {
			var key = $(this).attr('data-var');
			$(this).val(Booking[key]);
		});

		block.find("[data-var]").change(function() {
			var key = $(this).attr('data-var');
			Booking[key] = $(this).val();
		});

		return $view.append(block);


	},

	renderAccount : function($view) {
		
		$view.append("<h1>Account Page</h1>");

		switch (Account.state) {
			case "loading":
				var block = $("<div class='block'><h2>Loading login...</h2></div>");
				$view.append(block);
				break;
			case true:
				var block = $("<div class='block'></div>");
				block.append("<p><center><img src='"+Account.picture+"' /></center></p>");
				block.append("<p><strong>Name:</strong> "+Account.name+"</p>");
				$view.append(block);
				break;
			case false:
				var block = $("<div class='block'><h2>You are not currently logged in</h2></div>");
				var fieldset = $("<div class='fieldset'></div>");
				fieldset.append("<div class='field'><label>Email</label><input type='email' /></div>");
				fieldset.append("<div class='field'><label>Password</label><input type='password' /></div>");
				$view.append(block.append(fieldset));
				break;
		}
		return $view;
	},

	renderBookings : function($view) {
		$view.append("<div class='block'><h2>Bookings</h2></div>");
		return $view;
	},

	renderHelp : function($view) {
		$view.append("<div class='block'><h2>Help</h2></div>");
		$view.find(".block").append("<p>Welcome to the Taxicode App.</p>");
		$view.find(".block").append("<p><small>Developed by Web3r.</small></p>");
		return $view;
	},

	console : function() {
		if ($("#console").length) {
			$("#console").remove();
			$("#header > *").show();
		} else {
			$("#header > *").hide();
			$("#header").append("<div id='console'><input type='text' autocapitalize='off' autocorrect='off' /></div>");
			$("#console input:text").change(function() {
				eval($("#console input:text").val());
			});
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

		$("#app2").animate({left: 0}, {duration: duration, queue: false});
		$("#app").animate({left: -shift}, {duration: duration, queue: false, complete: function() {
			$("#app").css({left: 0}).empty().append($("#app2").children());
			$("#app2").remove();
		}});
	}
}
