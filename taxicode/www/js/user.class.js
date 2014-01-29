var User = {

	state : false,
	user : false,
	ready : false,

	initialize: function() {
		$this = this;
		$this.loadEmpty();

		API.get("user", {
			success: function(response) {
				if (response.status == "OK") {
					$this.load(response.user);
				} else {
					$this.state = false;
				}
				$this.refreshView();
			},
			complete: function() {
				User.ready = true;
			}
		});

	},

	loadEmpty: function() {
		this.user = false;
	},

	load: function(user) {
		if (user) {
			$this = this;
			$this.user = {};
			$.each(user, function(key, value) {
				$this.user[key] = value;
			});
			$this.state = true;
		} else {
			$this.state = false;
		}
		App.stopLoading();
		$this.refreshView();
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
				$this.refreshView();
			}
		});
	},

	refreshView: function() {
		if (Views.current == "account") {
			Views.refresh();
		}
	}

};
