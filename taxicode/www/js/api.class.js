var API = {

	default_retrys: false,

	get : function(uri, options, retrys) {

		retrys = retrys ? retrys : API.default_retrys;

		options = $.extend({
			data: {},
			success: function() {},
			failure: function() {},
			complete: function() {},
			type: "POST"
		}, options);

		var url = Config.domains.api + (uri ? uri : "");
		var ajax = {
			url: url,
			type: options.type,
			data: options.data,
			dataType: "jsonp",
			success: function(response) {
				console.log("["+(new Date().formatTime())+"] API '"+uri+"':", {
					sent: {
						url: url,
						data: options.data
					},
					response : response,
				});
				
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
		if (Config.get('public_key') || !Object.size(ajax.data) || ajax.type != "POST") {
			this.execute(ajax);
		} else {
			API.getKey(function(response) {
				API.execute(ajax);
			});
		}

	},

	execute : function (ajax) {
		if (Object.size(ajax.data) && ajax.type == "POST") {
			
			var json = JSON.stringify(ajax.data);
			var char_split = 475;

			if (json.length <= char_split) {

				var encrypted = API.encrypt(json);
				if (encrypted) {
					ajax.data = {encrypted: encrypted};
				} else {
					ajax.failure();
					App.alert('Apologies, an error has occured.');
					return false;
				}

			} else if (json.length <= char_split * 2) {

				var encrypted1 = API.encrypt(json.substr(0, char_split));
				var encrypted2 = API.encrypt(json.substr(char_split));

				if (encrypted1 && encrypted2) {
					ajax.data = {encrypted: encrypted1, encrypted2: encrypted2};
				} else {
					ajax.failure();
					App.alert('Apologies, an error has occured.');
					return false;
				}

			} else {
				ajax.failure();
				App.alert('Apologies, an error has occured.');
				return false;
			}
			
		}
		$.jsonp(ajax);
		return true;
	},

	encrypt : function (data) {
		var encrypted = RSA.encrypt(data, RSA.getPublicKey(Config.get('public_key')));
		return encrypted;
	},

	getKey : function (callback) {
		this.get("auth", {
			success: function(response) {
				Config.set('public_key', response.public_key);
				if (typeof callback == "function") {
					callback();
				}
			}
		});
	}

};
