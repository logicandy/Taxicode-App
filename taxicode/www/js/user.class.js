var User = {

	state : false,

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
		this.name =
		this.first_name =
		this.last_name =
		this.email =
		this.picture =
		this.locations = false;
	},

	load : function(user) {
		if (user) {
			$this = this;
			$.each(user, function(key, value) {
				$this[key] = value;
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
