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

(function loaderAnimation() {
	var width = 64;
	var frames = 12;
	$(".loader div").each(function() {
		var pos = parseInt($(this).css("background-position-x"));
		$(this).css("background-position-x", ((pos-width) % (-width*frames))+"px");
	});
	setTimeout(loaderAnimation, 50);
})();

function addMaps() {
	$(".map:not([data-loaded])[data-pickup]").each(function() {
		$(this).journey();
		$(this).attr('data-loaded', 1);
	});
	setTimeout(addMaps, 500);
};
(function setupAddMaps() {
	if (typeof google != "undefined") {
		google.maps.event.addDomListener(window, 'load', addMaps);
	} else {
		setTimeout(setupAddMaps, 1000);
	}
})();


// Fix input jump problem
$(document).on('blur', 'input, select, textarea', function() {
	$('#header').css({position: 'absolute'});
	$('#footer').css({position: 'absolute'});
});
$(window).scroll(function() {
	$('#header, #footer').css({position: 'fixed'});
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
