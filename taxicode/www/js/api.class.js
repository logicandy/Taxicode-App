var API = {

	public_key : false,

	get : function(uri, set_options) {

		var $this = this;

		var options = {
			data: {},
			success: function () {},
			failure: function () {}
		};

		if (set_options) {
			$.each(set_options, function(option, value) {
				options[option] = value;
			});
		}

		var failure = function() {};

		var ajax = {
			url: Config.domains.api + (uri ? uri : ""),
			type: "POST",
			data: options.data,
			dataType: "jsonp",
			success: function(response) {
				console.log("API '"+uri+"':", response);
				options.success(response);
			},
			failure: options.failure,
			error: options.failure
		};

		// Gets public_key if data needs to be encrypted and public key isn't here.
		if (this.public_key || !Object.size(ajax.data)) {
			this.execute(ajax);
		} else {
			$this.getKey(function(response) {
				$this.execute(ajax);
			});
		}

	},

	execute : function (ajax) {
		var $this = this;
		
		if (Object.size(ajax.data)) {
			var encrypted = $this.encrypt(JSON.stringify(ajax.data));
			if (encrypted) {
				ajax.data = {encrypted: encrypted};
			} else {
				ajax.failure();
				alert('API Error.');
				return false;
			}
		}

		$.ajax(ajax);
		return true;
	},

	encrypt : function (data) {
		var encrypted = RSA.encrypt(data, RSA.getPublicKey(this.public_key));
		return encrypted;
	},

	getKey : function (callback) {
		var $this = this;
		this.get("auth", {
			success: function(response) {
				$this.public_key = response.public_key;
				if (typeof callback == "function") {
					callback();
				}
			}
		});
	}

};
