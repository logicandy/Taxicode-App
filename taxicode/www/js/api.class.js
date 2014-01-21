var API = {

	api_domain : 'http://api:8888',

	public_key : false,

	get : function () {

		var $this = this;

		switch (arguments.length) {
			case 0:
				break;
			case 1:
				var uri = arguments[0];
				break;
			case 2:
				var uri = arguments[0];
				var callback = arguments[1];
				break;
			case 3:
			default:
				var uri = arguments[0];
				var data = arguments[1];
				var callback = arguments[2];
				break;
		}

		var ajax = {
			url: this.api_domain + "/" + (uri ? uri : ""),
			type: "POST",
			data: data ? data : {},
			dataType: "jsonp",
			success: function(response) {
				console.log("API '"+uri+"':", response);
				if (callback) {
					callback(response);
				}
			}
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
		
		$.each(ajax.data, function(key, value) {
			ajax.data[key] = $this.encrypt(value);
		});

		if (Object.size(ajax.data)) {
			ajax.encrypted = true;
		}

		$.ajax(ajax);
	},

	encrypt : function (data) {
		return data;
	},

	getKey : function (callback) {
		var $this = this;
		this.get("auth", function(response) {
			$this.public_key = response.public_key;
			if (typeof callback == "function") {
				callback();
			}
		});
	}

};
