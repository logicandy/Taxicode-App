var User = {

	state : false,
	user : false,

	initialize : function() {
		$this = this;
		$this.loadEmpty();
		$this.state = "loading"

		API.get("user", function(response) {
			if (response.status == "OK") {
				$this.load(response.user);
			} else {
				$this.state = false;
			}
			$this.refreshView();
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
		$this.refreshView();
	},

	login: function(email, password) {

		$this = this;
		$this.state = "loading";
		$this.refreshView();

		API.get("user/login", {email: email, password: password}, function(response) {
			if (response.status == "OK") {
				User.load(response.user);
			} else {
				$this.loadEmpty();
				$this.state = false;
				$this.refreshView();
			}
		});
	},

	logout: function() {

		$this = this;
		$this.state = "loading";
		$this.refreshView();

		API.get("user/logout", function(response) {
			if (response.status == "OK") {
				$this.loadEmpty();
				$this.state = false;
			}
			$this.refreshView();
		});
	},

	refreshView: function() {
		if (Views.current == "account") {
			Views.refresh();
		}
	}

};
