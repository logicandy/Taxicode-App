// Auto focus when click on labels in .field with matching form item
$(document).on("click", ".field label", function() {
	$(this).siblings("input, select, textarea").focus();
});

$(document).on("click", ".expand-block > h3", function() {
	$(this).siblings("div").slideToggle();
});

$(document).on("click", "[data-render]", function() {

	var render = $(this).attr('data-render');

	/*if (render == "booking") {
		$(this).attr('data-render', 'booking2');
	} else if (render == "booking2") {
		$(this).attr('data-render', 'booking');
	}*/

	if (render != "console") {
		$("[data-render]").removeClass('selected');
		$("[data-render='" + render + "']").addClass('selected');
	}

	Views.render(render, 'swap');

});

(function loaderAnimation() {
	$(".loader div").each(function() {
		var pos = parseInt($(this).css("background-position-x"));
		pos = pos-64;
		$(this).css("background-position-x", pos+"px");
	});

	setTimeout(loaderAnimation, 50);
})();

// Fix input jump problem
$(document).on('blur', 'input, select, textarea', function() {
	$('#header, #footer').css({position: 'absolute'});
});
$(window).scroll(function() {
	$('#header, #footer').css({position: 'fixed'});
});
