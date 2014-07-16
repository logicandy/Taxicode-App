// Auto focus when click on labels in .field with matching form item
$(document).on("click", ".field label", function() {
	$(this).siblings("input, select, textarea").focus();
});

$(document).on("click", ".expand-block > h3", function() {
	$(this).siblings("div").slideToggle();
});

$(document).on("click", "[data-render]", function() {

	var render = $(this).attr('data-render');
	if (render != "console") {
		$("[data-render]").removeClass('selected');
		$("[data-render='" + render + "']").addClass('selected');
	}
	Views.render(render, 'swap');

});

$(document).on("click", ".alert [data-action=close]", function() {
	$(this).closest(".alert").remove();
});

$(document).on("click", "[href^='tel:']", function() {
	if (Config.demo) {
		var tel = $(this).attr('href').substr(4);
		App.alert("On the live " + Config.title + " App, clicking this would call the number: " + tel, {title: "Demo Mode"});
	}
});

$(document).on("click", "body[data-status=offline] .btn.online, body[data-status=offline] a.online, body[data-status=offline] input.online", function() {
	App.alert("You need to be online.");
	return false;
});

(function changeTooltip() {
	$("[data-tooltip]").each(function() {
		if ($(this).is("[data-tooltip-next]")) {
			var tip = (parseInt($(this).attr("data-tooltip-next")) + 1) % App.tooltips.length;
			$(this).find(".inner").animate({opacity: 0}, 300, function() {
				$(this).find("span").html(App.tooltips[tip]).closest(".inner").animate({opacity: 1}, 300);
			});
		} else {
			var tip = (parseInt($(this).attr("data-tooltip")) + 1) % App.tooltips.length;
		}
		$(this).attr("data-tooltip-next", tip);
	});
	setTimeout(changeTooltip, 1000 * 10);
})();

$(document).on("click", ".tool-tip", function() {
	$this = $(this);
	App.confirm("Turn off tool tips?", function (response) {
		if (response) {
			Config.set("tooltips", "off");
			$this.animate({opacity: 0}, 300, function() {
				$this.remove();
			});
		}
	});
});

// (function loaderAnimation() {
// 	var width = 64;
// 	var frames = 12;
// 	$(".loader div").each(function() {
// 		var pos = parseInt($(this).css("background-position-x"));
// 		$(this).css("background-position-x", ((pos-width) % (-width*frames))+"px");
// 	});
// 	setTimeout(loaderAnimation, 50);
// })();

function addMaps() {
	$(".map:not([data-loaded])[data-pickup]").each(function() {
		$(this).journey();
		$(this).attr('data-loaded', 1);
	});
	setTimeout(addMaps, 500);
};

(function setupAddMaps() {
	if (typeof google != "undefined" && google.maps != "undefined") {
		addMaps();
	} else {
		setTimeout(setupAddMaps, 1000);
	}
})();

$(document).on("change", ".console input", function() {
	eval($(this).val());
});

$(document).on("click", "[data-help]", function() {
	App.alert($(this).attr('data-help'));
});

$(document).keypress(function(e) {
	if (e.keyCode == 13) {
		$(".alert .option:focus").click();
	}
});

var setupLayout = function(repeat) {
	$("#main").height(
		$(window).height()
		- $("#header").outerHeight()
		- $("#footer").outerHeight()
		- parseInt($("#main").css("padding-top"))
		- parseInt($("#main").css("padding-bottom"))
	);
	if (repeat === true) {
		setTimeout(setupLayout, Config.internalPing, true);
	}
}
$(document).ready(setupLayout);
$(window).resize(setupLayout);
setupLayout(true);

(function countChars() {
	$(".max-chars[data-for]").each(function() {
		var field = $("[name='"+$(this).attr("data-for")+"']");
		var chars = parseInt(field.attr("maxlength")) - field.val().replace(/\n/g, "  ").length;
		$(this).text("(" + chars + ")").css({color: chars <= 10 ? "red" : "#AAA"});
	});
	setTimeout(countChars, 100);
})();

(function adjustFullHeightElements() {
	// This function resets the css as height: 100% so that iOS devices are forced to update height when the window height changes.
	$(".alert, #offline").css({height: "100%"});
	setTimeout(adjustFullHeightElements, 250);
})();

function locateField(field) {
	var size = $(field).outerHeight();
	$(field).closest(".field").find(".locate-me").remove();
	$(field).width($(field).width() - size);
	$(field).after("<div class='locate-me'></div>");
}

$(document).ready(function() {
	// Scroll back down on refresh pull - currently not being used due to bug with short pages.
	/*
	$("#main").scroll(function() {
		var $this = $(this);
		if ($this.is("[data-scroll-top]:not(.refreshing)")) {
			var min = parseInt($this.attr("data-scroll-top"));
			var current = $this.scrollTop();
			// Pause to check if scrolled more
			setTimeout(function() {
				if ($this.scrollTop() == current) {
					if (current == 0 && typeof Views.refresh == "function") {
						Views.refresh();
					} else if (current < min) {
						$this.animate({scrollTop: min}, 100);
					}
				}
			}, 250);
		}
	});*/
});