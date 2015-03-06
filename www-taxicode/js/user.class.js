var User = {

	state : false,
	user : false,
	ready : false,

	initialize: function() {
		User.loadEmpty();

		API.get("user", {
			data: User.authObject(),
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
			Booking.getUserBookings(User.user.email, User.loadBookings);
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
		API.get("user/bookings", {data: User.authObject(), success: function(response) {
			if (response.status == "OK") {
				User.bookings = {};
				$.each(response.bookings, function(id, booking) {
					User.bookings[booking.reference] = booking;
				});
				Booking.saveUser();
			}
		}});
	},

	authObject: function() {
		return User.user && User.user.auth_token ? {auth_token: User.user.auth_token} : (Config.get('auth_token') ? {auth_token: Config.get('auth_token')} : {});
	},

	login: function(email, password, success, failure) {

		App.loading();
		User.refreshView(email);
		API.get("user/login", {
			data: {email: email, password: password},
			success: function(response) {
				if (response.status == "OK") {
					Analytics.event("User", "Login", "User successfully logged in", 1);
					User.load(response.user);
					Config.setting("login_email", email);
					if (typeof success == "function") {
						success();
					}
				} else {
					Analytics.event("User", "Login", "User failed to log in", 0);
					User.loadEmpty();
					User.state = false;
					App.stopLoading();
					User.refreshView(email);
					if (typeof failure == "function") {
						failure(response.error);
					} else {
						App.alert(response.error);
					}
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

	logout: function() {

		App.loading();
		User.refreshView();

		API.get("user/logout", {
			data: User.authObject(),
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

	refreshView: function(email) {
		if (Views.current == "account") {
			Views.render("account", "swap", {email: email});
		}
	},

	create: function(data) {
		App.loading();
		API.get("user/create", {
			data: data,
			success: function(response) {
				if (response.status == "OK") {
					User.verifyEmail = data.email;
					Views.render('account', undefined, 'verify');
				} else {
					App.alert(response.message);
				}
				App.stopLoading();
			}, failure: function() {
				App.stopLoading();
			}
		});
	},

	removeCard: function() {
		App.loading();
		API.get("user/removecard", {
			data: User.authObject(),
			success: function(response) {
				if (response.status == "OK") {
					User.user.card_token = false;
				}
				App.stopLoading();
				Views.render('account', 'swap', 'card');
			}, failure: function() {
				App.stopLoading();
			}
		});
	},

	changePassword: function(data) {
		App.loading();
		API.get("user/changepassword", {
			data: $.extend({}, User.authObject(), data),
			success: function(response) {
				if (response.status == "OK") {
					App.alert("Your password has been successfully changed.", {title: "Success"});
					Views.back();
				} else {
					App.alert(response.error);
				}
				App.stopLoading();
			}, failure: function() {
				App.stopLoading();
			}
		});
	},

	verify: function(data) {
		App.loading();
		API.get("user/verify", {
			data: data,
			success: function(response) {
				if (response.status == "OK") {
					Config.setting("login_email", response.user.email);
					User.load(response.user);
					App.stopLoading();
				} else {
					App.alert('Verification code failed');
					App.stopLoading();
				}
			},
			failure: function() {
				App.stopLoading();
			}
		});
	},

	loginPopup: function(success, error) {
		App.alert(
			Template.render('account/login_popup', {error: error}).html(),
			{
				title: "Login",
				options: {
					Cancel: function() {
						$(this).closest('.alert').remove();
					},
					Login: function() {
						$(this).closest('.alert').remove();

						var email = $(this).closest('.alert').find(".email").val();
						var password = $(this).closest('.alert').find(".password").val();
						User.login(email, password, function() {
							$(this).closest('.alert').remove();
							Views.refreshView();
							if (typeof success == "function") {
								success();
							}
						}, function(error) {
							User.loginPopup(success, error);
						});

					}
				},
			}

		);
	},

    forgotPopup: function(success, error) {
        App.alert(
            Template.render('account/forgot_password', {error: error}).html(),
            {
                title: "Forgot Password",
                options: {
                    Cancel: function() {
                        $(this).closest('.alert').remove();
                    },
                    Submit: function() {
                        App.loading();
                        var email = $(this).closest('.alert').find(".email").val();
                        API.get("user/forgot_password", {
                            data: {email: email},
                            success: function(response) {
                                App.stopLoading();
                                alert(response['message']);
                            }, failure: function() {
                                App.stopLoading();
                            }
                        });

                    }
                }
            }
        );
    }


};
