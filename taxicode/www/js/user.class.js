var User = {

	state : false,
	user : false,
	ready : false,

	initialize: function() {
		User.loadEmpty();

		API.get("user", {
			success: function(response) {
				if (response.status == "OK") {
					User.load(response.user, false);
				} else {
					User.state = false;
				}
				User.refreshView();
			},
			complete: function() {
				User.ready = true;
			}
		});

	},

	loadEmpty: function() {
		this.user = false;
	},

	load: function(user, stopLoading) {
		if (user) {
			User.user = {};
			$.each(user, function(key, value) {
				User.user[key] = value;
			});
			User.state = true;
			User.loadBookings();
		} else {
			User.state = false;
		}
		if (stopLoading !== false) {
			App.stopLoading();
		}
		User.refreshView();
	},

	bookings: {},
	loadBookings: function() {
		API.get("user/bookings", {success: function(response) {
			if (response.status == "OK") {
				User.bookings = {};
				$.each(response.bookings, function(id, booking) {
					User.bookings[booking.reference] = booking;
				});
			}
		}});
	},

	login: function(email, password) {

		App.loading();
		User.refreshView();
		API.get("user/login", {
			data: {email: email, password: password},
			success: function(response) {
				if (response.status == "OK") {
					User.load(response.user);
					Config.setting("login_email", email);
				} else {
					User.loadEmpty();
					User.state = false;
					App.stopLoading();
					User.refreshView();
				}
			},
			failure: function() {
				User.state = false;
				App.stopLoading();
				User.refreshView();
			}
		});
	},

	logout: function() {

		App.loading();
		User.refreshView();

		API.get("user/logout", {
			success: function(response) {
				if (response.status == "OK") {
					User.loadEmpty();
					User.state = false;
					App.stopLoading();
				}
				User.refreshView();
			}
		});
	},

	refreshView: function() {
		if (Views.current == "account") {
			Views.refresh();
		}
	}

};
