var User = {

	state : false,
	user : false,

	initialize : function() {
		$this = this;
		$this.loadEmpty();

		App.loading();

		API.get("user", {
			success: function(response) {
				if (response.status == "OK") {
					$this.load(response.user);
				} else {
					$this.state = false;
				}
				App.stopLoading();
				$this.refreshView();
			}
		});

	},

	loadEmpty : function() {
		this.user = false;
	},

	load : function(user) {
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

		$this = this;
		App.loading();
		$this.refreshView();

		API.get("user/login", {
			data: {email: email, password: password},
			success: function(response) {
				if (response.status == "OK") {
					User.load(response.user);
				} else {
					$this.loadEmpty();
					$this.state = false;
					App.stopLoading();
					$this.refreshView();
				}
			},
			failure: function() {
				$this.state = false;
				App.stopLoading();
				$this.refreshView();
			}
		});
	},

	logout: function() {

		$this = this;
		App.loading();
		$this.refreshView();

		API.get("user/logout", {
			success: function(response) {
				if (response.status == "OK") {
					$this.loadEmpty();
					$this.state = false;
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
