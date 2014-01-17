var API = {

	api_domain : 'http://api:8888',

	get : function () {

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

		$.ajax({
			url: this.api_domain + "/" + (uri ? uri : ""),
			type: "POST",
			data: data ? data : {},
			dataType: "jsonp",
			success: callback ? callback : function(response) {
				console.log(response);
			}
		});

	}

};
