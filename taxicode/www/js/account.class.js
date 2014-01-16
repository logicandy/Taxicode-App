var Account = {

	first_name : "Nod",
	last_name : "Godburt",
	email : "",

	renderAccount : function() {

		App.empty();
		App.append("<h1>Account Page</h1>");

		var block = $("<div class='block'><h2>You are not currently logged in</h2></div>");
		var fieldset = $("<div class='fieldset'></div>");
		fieldset.append("<div class='field'><label>Email</label><input type='email' /></div>");
		fieldset.append("<div class='field'><label>Password</label><input type='password' /></div>");

		App.append(block.append(fieldset));

	},

	viewBookings : function() {

		$("#app").empty();
		$("#app").append("<div class='block'><h2>Bookings</h2></div>");
		$("#app .block").append("");

	}

};
