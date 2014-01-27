var Template = {

	ext: ".tpl",

	templates: {
		"booking"			: false,
		"account/login"		: false,
		"account/user"		: false,
		"bookings"			: false,
		"help"				: false,
		"offline"			: false
	},

	loaded: 0,

	ready: false,

	initialize: function() {
		$.each(this.templates, function(name, value) {
			$.ajax({
				url: Config.dirs.views + name + Template.ext,
				success: function(data) {
					Template.templates[name] = data;
				},
				complete: function() {
					Template.loaded++;
				}
			});
		});
		Template.checkReady();
	},

	checkReady: function() {
		if (Template.loaded == Object.size(Template.templates)) {
			Template.ready = true;
		} else {
			setTimeout(Template.checkReady, Config.internalPing);
		}
	},

	render: function(template, data) {
		var output = this.templates[template];

		if (typeof this.templates[template] == "undefined") {
			console.error("Template Error: '"+template+"' not defined");
			return false;
		}

		if (this.templates[template] === false) {
			console.error("Template Error: Load error please check it exists at '" + Config.dirs.views + template + Template.ext + "'");
			return false;
		}
		return $(this.processBlock(output, data));
	},

	processBlock: function(output, data) {
		Template.data = data;

		// Foreach block {{#foreach variable}} ... {{#endforeach}}
		output = output.replace(/{{#foreach (.*?)}}((.|\n)*?){{#endforeach}}/g, function(pre, variable, block) {
			var ret = "";
			$.each(eval(variable), function() {
				data.key = Array.isArray(variable) ? arguments[1] : arguments[0];
				data.val = Array.isArray(variable) ? arguments[0] : arguments[1];
				ret += Template.processBlock(block, data);
			});
			return ret;
		});

		// If block {{#if condition}} ... {{#endif}}
		output = output.replace(/{{#if (.*?)}}((.|\n)*?){{#endif}}/g, function(pre, condition, block) {
			return eval(condition) ? Template.processBlock(block, data) : "";
		});

		// Evals {{%eval}}
		output = output.replace(/{{%(.*?)}}/g, function(pre, statement) {
			return eval(statement);
		});

		// Data {{$data}}
		output = output.replace(/{{\$(.*?)}}/g, function(pre, variable) {
			return Template.data[variable];
		});

		return output;
	}

};
