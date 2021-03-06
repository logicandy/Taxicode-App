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
	$(".map:not([data-loaded]):not([data-pickup])[data-lat][data-lng]").each(function() {
		$(this).location();
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


// Fix input jump problem
$(document).on('blur', 'input, select, textarea', function() {
	//$('#header').css({position: 'absolute'});
	//$('#footer').css({position: 'absolute'});
});
$(window).scroll(function() {
	//$('#header, #footer').css({position: 'fixed'});
});

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

var windowHeight = 0;
var setupLayout = function(repeat) {
	windowHeight = Math.max($(window).height(), windowHeight);
	$("#main").height(
		windowHeight
		- $("#header").outerHeight()
		- $("#footer").show().outerHeight()
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

function locateField(fields) {
	if (navigator && navigator.geolocation) {
		$(fields).addClass("locatable");
	}
}

$(document).on("click", ".locatable", function(e) {
	if (!$(this).is(".located") && e.offsetX > $(this).outerWidth() - $(this).outerHeight()) {
		getLocationForField(this);
	}
});

function getLocationForField(field) {
	console.log(field);
	navigator.geolocation.getCurrentPosition(function(geolocation) {
		$(field).after($(field).addClass("located").val("Your Location").attr({
			"data-lat": geolocation.coords.latitude,
			"data-lng": geolocation.coords.longitude
		}).clone());
		Booking.data[$(field).attr('name')] = {
			lat: geolocation.coords.latitude,
			lng: geolocation.coords.longitude
		};
		$(field).remove();
	}, function() {
		$(field).val("");
		App.alert("Can't find your current location.");
	});
}

$(document).on("click", ".locatable.located", function(e) {
	$(this).removeClass("located").val("");
	if ($(this).is(".tc-autocomplete-field")) {
		$(this).change(function() {
			Booking.data[$(this).attr('name')] = $(this).val();
		});
		Taxicode_Autocomplete(this);
	}
});

var resizeIFrame = function() {
	$(".iframe-outer").each(function() {
		$(this).width($(window).width()).height($(window).height());
		$(this).find("iframe").width($(window).width() - 20).height($(window).height() - 20);
	});
}
$(window).resize(resizeIFrame);

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

$(document).on("click", ".btn-ink", function(event) {

	if (!$(this).children().length) {
		$(this).html("<span>" + $(this).html() + "</span>");
	}

	var ink = $("<span class='ink'></span>")
	$(this).prepend(ink);
	var size = Math.max($(this).width(), $(this).height());
	var x = event.pageX - $(this).offset().left - size / 2;
	var y = event.pageY - $(this).offset().top - size / 2;
	ink.css({width: size, height: size, top: y + "px", left: x + "px"});
	setTimeout(function() {
		ink.remove();
	}, 1000);
});


