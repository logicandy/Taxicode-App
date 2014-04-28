var Taxicode_Autocomplete = {

	cache: {},
	i: 0,
	country_code: 'gb',

	setup: function() {
		jQuery(document).click(function() {
			if (jQuery(".tc-autocomplete-suggestions").length) {
				Taxicode_Autocomplete.removeResults();
			}
		});
		Taxicode_Autocomplete.setup = function() {};
	},

	add: function(field) {

		Taxicode_Autocomplete.setup();

		if (!jQuery(field).attr("placeholder")) {
			jQuery(field).attr({placeholder: "Enter a location"});
		}
		jQuery(field).attr({autocomplete: "off"});

		jQuery(field).attr("data-autocomplete-id", Taxicode_Autocomplete.i++);

		jQuery(field).change(function() {
			if (jQuery(this).attr("data-autocomplete-current") != jQuery(this).val()) {
				Taxicode_Autocomplete.search(jQuery(this).val(), this);
			}
		}).keyup(function(event) {
			if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
				Taxicode_Autocomplete.search(jQuery(this).val(), this);
			}
		}).click(function(event) {
			Taxicode_Autocomplete.search(jQuery(this).attr("data-autocomplete-search") ? jQuery(this).attr("data-autocomplete-search") : jQuery(this).val(), this);
			event.stopPropagation();
		}).focus(function() {
			Taxicode_Autocomplete.removeResults();
		}).keydown(function(event) {
			if (jQuery(".tc-autocomplete-suggestions")) {
				switch(event.keyCode) {
					case 40: // UP
						var index = jQuery(".tc-autocomplete-suggestions li.selected").index() + 1;
						jQuery(".tc-autocomplete-suggestions li").removeClass("selected");
						jQuery(jQuery(".tc-autocomplete-suggestions li")[index]).addClass("selected");
						Taxicode_Autocomplete.shiftResultsScroll();
						return false;
					case 38: // DOWN
						var index = jQuery(".tc-autocomplete-suggestions li.selected").index() - 1;
						index = index < 0 ? jQuery(".tc-autocomplete-suggestions li").length - 1 : index;
						jQuery(".tc-autocomplete-suggestions li").removeClass("selected");
						jQuery(jQuery(".tc-autocomplete-suggestions li")[index]).addClass("selected");
						Taxicode_Autocomplete.shiftResultsScroll();
						return false;
					case 13: // ENTER
						if (jQuery(".tc-autocomplete-suggestions li.selected").length) {
							Taxicode_Autocomplete.selectResult(
								jQuery(".tc-autocomplete-suggestions li.selected").text(),
								jQuery(".tc-autocomplete-suggestions").attr("data-term"),
								jQuery(this).attr("data-autocomplete-id")
							);
						}
						return false;
				}
			}
		});

	},

	search: function(term, field) {
		if (term.length >= 3) {
			jQuery(field).attr("data-autocomplete-current", term);
			jQuery(field).addClass("tc-autocomplete-searching");
			if (Taxicode_Autocomplete.cache[term]) {
				Taxicode_Autocomplete.results(term, field);
			} else {
				API.get("places", {
					data: {term: term, country: Taxicode_Autocomplete.country_code},
					success: function(response) {
						if (response.status == "OK") {
							Taxicode_Autocomplete.cache[response.term] = response.results
							Taxicode_Autocomplete.results(response.term, field);
						}
					}
				});
			}
			jQuery(field).removeAttr("data-autocomplete-search");
		} else {
			jQuery(field).removeClass("tc-autocomplete-searching");
		}
	},

	results: function(term, field) {
		if (term == jQuery(field).val() || term == jQuery(field).attr("data-autocomplete-search")) {
			jQuery(field).removeClass("tc-autocomplete-searching");
			Taxicode_Autocomplete.removeResults();
			var suggestions = jQuery("<ul class='tc-autocomplete-suggestions' data-term='" + term + "'></ul>");
			suggestions.css({
				top: jQuery(field).offset().top + jQuery(field).outerHeight(),
				left: jQuery(field).offset().left,
				width: jQuery(field).outerWidth()
			});
			jQuery.each(Taxicode_Autocomplete.cache[term], function(group, results) {
				jQuery.each(results, function(i, result) {
					suggestions.append("<li>" + (typeof result == "object" ? result.string : result) + "</li>");
				});
			});
			jQuery("body").append(suggestions);

			jQuery(".tc-autocomplete-suggestions").find("li").click(function(event) {
				Taxicode_Autocomplete.selectResult(jQuery(this).text(), term, jQuery(field).attr("data-autocomplete-id"));
				event.stopPropagation();
			});

			jQuery(".tc-autocomplete-suggestions").find("li").each(function() {
				var text = jQuery(this).text().split(",");
				var new_text = "";
				for (var i = 0; i < text.length; i++) {
					new_text += (i ? "<span class='comma comma" + (i+1) + "'>,</span> " : "") + "<span class='text-block" + (i+1) + "'>" + text[i] + "</span>";
				}
				jQuery(this).html(new_text.replace(/\ \ /g, ' '));
			});

		}
	},

	selectResult: function(string, term, field_id) {
		jQuery("[data-autocomplete-id='" + field_id + "']")
			.attr("data-autocomplete-search", term)
			.val(string.replace(/\ \ /g, ' '));
		Taxicode_Autocomplete.removeResults();
	},

	removeResults: function() {
		jQuery(".tc-autocomplete-suggestions").remove();
	},

	shiftResultsScroll: function() {
		if (jQuery(".tc-autocomplete-suggestions .selected").length) {
			var height = jQuery(".tc-autocomplete-suggestions").height();
			var li_height = jQuery(".tc-autocomplete-suggestions li.selected").outerHeight();
			var scrollTop = jQuery(".tc-autocomplete-suggestions").scrollTop();
			var top = jQuery(".tc-autocomplete-suggestions .selected").position().top + scrollTop;
			if (top > height - li_height + scrollTop) {
				jQuery(".tc-autocomplete-suggestions").scrollTop(top - height + li_height);
			} else if (top < scrollTop) {
				jQuery(".tc-autocomplete-suggestions").scrollTop(top);
			}
		}
	}

};
