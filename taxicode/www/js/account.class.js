var Account = {

	first_name : "Nod",
	last_name : "Godburt",
	email : "",

	renderAccount : function() {

		$("#app").empty();
		$("#app").append("<div class='block'>Account Page</div>");

	},

	viewBookings : function() {

		$("#app").empty();
		$("#app").append("<div class='block'><h2>Bookings</h2></div>");
		$("#app .block").append("");

	}

};
