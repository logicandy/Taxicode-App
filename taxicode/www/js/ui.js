// Auto focus when click on labels in .field with matching form item
$(document).on("click", ".field label", function() {
	$(this).siblings("input, select, textarea").focus();
});

(function repeater() {
	var val = $(window).height() + ' ' + $('body').height();
	// $("#console input").val(val);
	setTimeout(repeater, 500);
})();