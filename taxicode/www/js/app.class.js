var App = {

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
					break;
				case "account":
					Account.renderAccount();
					break;
				case "bookings":
					Account.viewBookings();
					break;
				case "help":
					$this.renderHelp();
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
		$("#app .block").append("");
	}

}