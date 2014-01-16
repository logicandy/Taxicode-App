var App = {

	element : $("#app"),

	initialize : function() {

		var $this = this;

		if (typeof StatusBar != "undefined") {
			StatusBar.styleLightContent();
			StatusBar.overlaysWebView();
		}

		document.addEventListener("deviceready", 
			function(e) {
				alert.log(e);
			}
		);


		$("[data-render]").click(function() {

			var render = $(this).attr('data-render');

			$("[data-render]").removeClass('selected');
			$("[data-render='" + render + "']").addClass('selected');

			switch (render) {
				case "booking":
					Booking.renderEngine();
					$this.breadcrumbs = [];
					break;
				case "account":
					Account.renderAccount();
					$this.breadcrumbs = [];
					break;
				case "bookings":
					Account.viewBookings();
					$this.breadcrumbs = [];
					break;
				case "help":
					$this.renderHelp();
					$this.breadcrumbs = [];
					break;
				case "console":
					$this.console();
					break;
			}

		});
		
	},

	console : function() {
		if ($("#console").length) {
			$("#console").remove();
		} else {
			$("#app").append("<div id='console'><input type='text' /></div>");
			$("#console input:text").change(function() {
				eval($("#console input:text").val());
			});
		}
	},

	renderHelp : function() {

		$("#app").empty();
		$("#app").append("<div class='block'><h2>Help</h2></div>");
		$("#app .block").append("<p><a class='btn' onclick='App.shift(false,+1);'>NEXT</a></p>");
		$("#app .block").append("<p><a class='btn' onclick='App.shift(false,-1);'>BACK</a></p>");
	},

	breadcrumbs : [],

	shift : function (panel, d) {

		panel = this.element.clone();
		var shift = $(document).width() * d;
		var height = this.element.height();

		panel.attr({id: 'app2'}).css({left: shift, top: -this.element.offset().top-height});

		var duration = 600;
		$("#app").after(panel);

		$("#app2").animate({left: 0}, {duration: duration, queue: false});
		$("#app").animate({left: -shift}, {duration: duration, queue: false, complete: function() {
			$("#app").css({left: 0}).html($("#app2").html());
			$("#app2").remove();
		}});
	},

	/* jQuery helpers */
	find : function(a) { return this.element.find(a); },
	append : function(a) { return this.element.append(a); },
	empty : function() { return this.element.empty(); }

}