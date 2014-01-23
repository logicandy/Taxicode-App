// Auto focus when click on labels in .field with matching form item
$(document).on("click", ".field label", function() {
	$(this).siblings("input, select, textarea").focus();
});

$(document).on("click", ".expand-block > h3", function() {
	$(this).siblings("div").slideToggle();
});

$(document).on("click", "[data-render]", function() {

	var render = $(this).attr('data-render');

	// $(this).attr('data-render', render == "booking" ? "booking2" : "booking");

	if (render != "console") {
		$("[data-render]").removeClass('selected');
		$("[data-render='" + render + "']").addClass('selected');
	}

	Views.render(render, 'swap');

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

// Fix input jump problem
$(document).on('blur', 'input, select, textarea', function() {
	$('#header, #footer').css({position: 'absolute'});
});
$(window).scroll(function() {
	$('#header, #footer').css({position: 'fixed'});
});

$(document).on("change", "#console input:text", function() {
	eval($("#console input:text").val());
});
