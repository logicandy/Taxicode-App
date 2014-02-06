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
					errors.push({field: this, message: "Can't be before "+min_date+"."});
				} else {
					errors.push({field: this, message: "Field is too low."});
				}
			}
		});

		// Types
		$(form).find("[type=tel]").each(function() {
			if ($(this).val().length < 6) {
				errors.push({field: this, message: "Please enter a valid phone number."});
			}
		});
		$(form).find("[data-type=cardnumber]").each(function() {
			var number = $(this).val().trim().replace(/ /g,'');
			// Check length of number
			if (number.length < 12 || number.length > 20) {
				errors.push({field: this, message: "Invalid card number."});
				return;
			}
			// Use Luhn Algorithm to check card number
			var number_s = number.split("");
			var sum = 0;
			var n = 0;
			for (var i = number_s.length-2; i >= 0; i--) {
				var d = parseInt(number_s[i]) * (n%2 ? 1 : 2)
				sum += d < 10 ? d : $.map((d+"").split(""), function(n) {
					return parseInt(n);
				}).reduce(function(a,b) {
					return a+b;
				});
				n++;
			}
			var check = (sum*9)%10;
			if (check != parseInt(number_s.pop())) {
				errors.push({field: this, message: "Invalid card number."});
			}
		});
		$(form).find("[data-type=cv2]").each(function() {
			if ($(this).val().length != 3) {
				errors.push({field: this, message: "Invalid CV2."});
			}
		});

		Form.renderErrors(errors);
		return errors;
	},

	renderErrors: function(errors) {
		if (errors.length) {
			App.alert(Template.render('errors', {errors: errors}).html());
		}
	},

	data: function(form) {
		var data = {};
		$(form).find("[name]").each(function() {
			data[$(this).attr('name')] = $(this).val();
		});
		return data;
	}

};

$(document).on("submit", "form", function() {
	if (!Form.validate(this).length && eval($(this).attr('data-validate')) !== false) {
		var func = eval($(this).attr('data-submit'));
		if (typeof func == "function") {
			func(Form.data(this));
		}
	}
	return false;
});
