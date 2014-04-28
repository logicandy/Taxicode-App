var Autocomplete = {

	cache: {},
	i: 0,

	setup: function() {
		$(document).click(function() {
			if ($(".tc-autocomplete-suggestions").length) {
				Autocomplete.removeResults();
			}
		});
		Autocomplete.setup = function() {};
	},

	add: function(field) {

		Autocomplete.setup();

		if (!$(field).attr("placeholder")) {
			$(field).attr("placeholder", "Enter a location");
		}

		$(field).attr("data-autocomplete-id", Autocomplete.i++);

		$(field).change(function() {
			Autocomplete.search($(this).val(), this);
		}).keyup(function(event) {
			if (event.keyCode != 38 && event.keyCode != 40 && event.keyCode != 13) {
				Autocomplete.search($(this).val(), this);
			}
		}).click(function(event) {
			Autocomplete.search($(this).attr("data-autocomplete-search") ? $(this).attr("data-autocomplete-search") : $(this).val(), this);
			event.stopPropagation();
		}).focus(function() {
			Autocomplete.removeResults();
		}).keydown(function(event) {
			if ($(".tc-autocomplete-suggestions")) {
				switch(event.keyCode) {
					case 40: // UP
						var index = $(".tc-autocomplete-suggestions li.selected").index() + 1;
						$(".tc-autocomplete-suggestions li").removeClass("selected");
						$($(".tc-autocomplete-suggestions li")[index]).addClass("selected");
						Autocomplete.shiftResultsScroll();
						return false;
					case 38: // DOWN
						var index = $(".tc-autocomplete-suggestions li.selected").index() - 1;
						index = index < 0 ? $(".tc-autocomplete-suggestions li").length - 1 : index;
						$(".tc-autocomplete-suggestions li").removeClass("selected");
						$($(".tc-autocomplete-suggestions li")[index]).addClass("selected");
						Autocomplete.shiftResultsScroll();
						return false;
					case 13: // ENTER
						if ($(".tc-autocomplete-suggestions li.selected").length) {
							Autocomplete.selectResult(
								$(".tc-autocomplete-suggestions li.selected").text(),
								$(".tc-autocomplete-suggestions").attr("data-term"),
								$(this).attr("data-autocomplete-id")
							);
						}
						return false;
				}
			}
		});

	},

	search: function(term, field) {
		if (term.length >= 3 && $(field).attr("data-autocomplete-current") != term) {
			$(field).attr("data-autocomplete-current", term);
			if (Autocomplete.cache[term]) {
				Autocomplete.results(term, field);
			} else {
				API.get("places", {
					data: {term: term, country: Config.country_code},
					success: function(response) {
						if (response.status == "OK") {
							Autocomplete.cache[response.term] = response.results
							Autocomplete.results(response.term, field);
						}
					}
				});
			}
			$(field).removeAttr("data-autocomplete-search");
		}
	},

	results: function(term, field) {
		if (term == $(field).val() || term == $(field).attr("data-autocomplete-search")) {
			Autocomplete.removeResults();
			var suggestions = $("<ul class='tc-autocomplete-suggestions' data-term='" + term + "'></ul>");
			suggestions.css({
				top: $(field).offset().top + $(field).outerHeight(),
				left: $(field).offset().left,
				width: $(field).outerWidth()
			});
			$.each(Autocomplete.cache[term], function(group, results) {
				$.each(results, function(i, result) {
					suggestions.append("<li>" + (typeof result == "object" ? result.string : result) + "</li>");
				});
			});
			$("body").append(suggestions);

			$(".tc-autocomplete-suggestions").find("li").click(function(event) {
				Autocomplete.selectResult($(this).text(), term, $(field).attr("data-autocomplete-id"));
				event.stopPropagation();
			});

		}
	},

	selectResult: function(string, term, field_id) {
		$("[data-autocomplete-id='" + field_id + "']")
			.attr("data-autocomplete-search", term)
			.val(string);
		Autocomplete.removeResults();
	},

	removeResults: function() {
		$(".tc-autocomplete-suggestions").remove();
	},

	shiftResultsScroll: function() {
		if ($(".tc-autocomplete-suggestions .selected").length) {
			var height = $(".tc-autocomplete-suggestions").height();
			var li_height = $(".tc-autocomplete-suggestions li.selected").outerHeight();
			var scrollTop = $(".tc-autocomplete-suggestions").scrollTop();
			var top = $(".tc-autocomplete-suggestions .selected").position().top + scrollTop;
			if (top > height - li_height + scrollTop) {
				$(".tc-autocomplete-suggestions").scrollTop(top - height + li_height);
			} else if (top < scrollTop) {
				$(".tc-autocomplete-suggestions").scrollTop(top);
			}
		}
	}

};
