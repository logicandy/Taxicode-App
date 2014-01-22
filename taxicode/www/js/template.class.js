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

		this.data = data;

		return $(this.processBlock(output));
	},

	processBlock: function(output) {
		$this = this;
		// Evals {{%eval}}
		output = output.replace(/{{%(.*?)}}/g, function($0, $1) {
			return eval($1);
		});

		// Data {{$data}}
		output = output.replace(/{{\$(.*?)}}/g, function($0, $1) {
			return eval("Template.data."+$1);
		});

		// If block {{#if}} ... {{#endif}}
		output = output.replace(/{{#if (.*?)}}((.|\n)*?){{#endif}}/g, function($0, $1, $2) {
			return eval($1) ? $this.processBlock($2) : "";
		});

		// Foreach block {{#foreach array/obj}} ... {{#endforeach}}
		// To do

		return ouput;
	}

};

Template.initialize();
