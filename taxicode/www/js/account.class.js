var Account = {

	state : false,

	name : false,
	first_name : false,
	last_name : false,
	email : false,
	picture : false,
	locations : false,

	initialize : function() {

		$this = this;

		$this.state = "loading"

		API.get("user", function(response) {
			if (response.status == "OK") {
				$this.state = true;
				$this.load(response.user);
			} else {
				$this.state = false;
			}
		});

	},

	load : function(user) {
		$this = this;
		$.each(user, function(key, value) {
			$this[key] = value;
		});
		$this.state = true;
	}

};
