var User = {

	state : false,
	user : false,
	ready : false,
	bookings: {},

	initialize: function() {
		User.loadEmpty();
		API.get("dashboard", {
			data: User.authObject(),
			success: function(response) {
				if (response.status == "OK" && response.user) {
					User.load(response.user, false);
				} else {
					User.state = false;
				}
			},
			complete: function() {
				User.ready = true;
			}
		});

	},

	loadEmpty: function() {
		User.user = false;
		$("body").attr("data-user", "false");
	},

	load: function(user, stopLoading) {
		if (user) {
			User.user = {};
			$.each(user, function(key, value) {
				User.user[key] = value;
			});
			$("body").attr("data-user", User.user.email);
			User.state = true;
			Config.set('auth_token', User.user.auth_token);
			$("#footer").show();
		} else {
			User.state = false;
		}
		$("#company_name").text(User.user.company.name);
		if (stopLoading !== false) {
			App.stopLoading();
		}
	},

	authObject: function() {
		return User.user && User.user.auth_token ? {auth_token: User.user.auth_token} : (Config.get('auth_token') ? {auth_token: Config.get('auth_token')} : {});
	},

	login: function(data) {

		App.loading();
		API.get("dashboard/login", {
			data: {email: data.email, password: data.password},
			success: function(response) {
				if (response.status == "OK") {
					Analytics.event("User", "Login", "User successfully logged in", 1);
					User.load(response.user);
					Config.setting("login_email", data.email);
					Views.render("new");
				} else {
					Analytics.event("User", "Login", "User failed to log in", 0);
					User.loadEmpty();
					User.state = false;
					App.stopLoading();
					App.alert(response.error);
				}
			},
			failure: function() {
				User.state = false;
				App.stopLoading();
				User.refreshView(email);
				if (typeof failure == "function") {
					failure();
				}
			}
		});
	},

	getBookings: function(mode) {
		API.get("dashboard/bookings", {
			data: $.extend({mode: mode}, User.authObject()),
			success: function(response) {
				if (response.status == "OK") {
					User.bookings[mode] = response.bookings;
				}
			}
		});
	},

	logout: function() {
		App.loading();
		API.get("dashboard/logout", {
			data: User.authObject(),
			success: function(response) {
				if (response.status == "OK") {
					User.loadEmpty();
					User.state = false;
					App.stopLoading();
				}
				User.refreshView();
				$("#company_name").text("Partner Dashboard");
			}
		});
	}

};
