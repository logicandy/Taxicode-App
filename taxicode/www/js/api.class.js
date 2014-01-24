var API = {

	public_key : false,
	default_retrys: false,

	get : function(uri, set_options, retrys) {

		var retrys = retrys ? retrys : API.default_retrys;

		var $this = this;

		var options = {
			data: {},
			success: function () {},
			failure: function () {},
			complete: function () {},
			type: "POST"
		};

		if (set_options) {
			$.each(set_options, function(option, value) {
				options[option] = value;
			});
		}

		var failure = function() {};

		var ajax = {
			url: Config.domains.api + (uri ? uri : ""),
			type: options.type,
			data: options.data,
			dataType: "jsonp",
			success: function(response) {
				console.log("API '"+uri+"':", response);

				if (response.status == "BAD_PUBLIC_KEY") {
					API.getKey(retrys > 0 ? function() {
						API.get(uri, set_options, retrys-1);
					}:options.failure);
				} else {
					options.success(response);
				}
			},
			failure: options.failure,
			error: options.error ? options.error : options.failure,
			complete: options.complete
		};

		// Gets public_key if data needs to be encrypted and public key isn't here.
		if (this.public_key || !Object.size(ajax.data) || ajax.type != "POST") {
			this.execute(ajax);
		} else {
			$this.getKey(function(response) {
				$this.execute(ajax);
			});
		}

	},

	execute : function (ajax) {
		var $this = this;
		
		if (Object.size(ajax.data) && ajax.type == "POST") {
			var encrypted = $this.encrypt(JSON.stringify(ajax.data));
			if (encrypted) {
				ajax.data = {encrypted: encrypted};
			} else {
				ajax.failure();
				alert('API Error.');
				return false;
			}
		}
		console.log(ajax);
		$.jsonp(ajax);
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
