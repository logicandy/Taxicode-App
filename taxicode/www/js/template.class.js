var Template = {

	ext: ".tpl",

	templates: {
		"booking"			: false,
		"account/login"		: false,
		"account/user"		: false,
		"bookings"			: false,
		"help"				: false
	},

	initialize: function() {
		$.each(this.templates, function(name, value) {
			$.ajax({
				url: Config.dirs.views + name + Template.ext,
				success: function(data) {
					Template.templates[name] = data;
				}
			});
		});
	},

	render: function(template, data) {
		var output = this.templates[template];

		if (typeof this.templates[template] == "undefined") {
			return false;
		}

		// Evals {{%eval}}
		output = output.replace(/{{%(.*?)}}/g, function($0, $1) {
			return eval($1);
		});

		// Data {{$data}}
		output = output.replace(/{{\$(.*?)}}/g, function($0, $1) {
			return eval("data."+$1);
		});

		// If block {{#if}} ... {{#endif}}
		output = output.replace(/{{#if (.*?)}}((.|\n)*?){{#endif}}/g, function($0, $1, $2) {
			console.log("ARGS",arguments);
			return eval($1) ? $2 : "";
		});


		/*
			$.each(data?data:{}, function(key, value) {
				console.log(key, value);
				output = output.split("{{$"+key+"}}").join(value);
				//output = output.replace("/{"+key+"}/g", value);
			});
		*/

		return $(output);
	}

};

Template.initialize();
