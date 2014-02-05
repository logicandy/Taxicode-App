var Form = {

	validate: function(form) {

		var errors = [];
		
		// Required fields
		$(form).find("[data-required=true]").each(function() {
			if ($(this).val().trim() == "") {
				errors.push({
					field: this,
					message: "Field is required."
				});
			}
		});

		// Min values
		$(form).find("[data-min]").each(function() {
			if ($(this).val().trim() < $(this).attr('data-min').trim()) {
				if ($(this).is("[type=date]")) {
					var min_date = new Date($(this).attr('data-min').trim()).format("d/m/Y");
					errors.push({
						field: this,
						message: "Can't be before "+min_date+"."
					});
				} else {
					errors.push({
						field: this,
						message: "Field is too low."
					});
				}
			}
		});

		// Types

		$(form).find("[data-type=telephone]")

		Form.renderErrors(errors);
		return errors;
	},

	renderErrors: function(errors) {
		if (errors.length) {
			App.alert(Template.render('errors', {errors: errors}).html());
		}
	}

};

$(document).on("submit", "form", function() {
	if (!Form.validate(this).length && eval($(this).attr('data-validate')) !== false) {
		eval($(this).attr('data-submit'));
	}
	return false;
});