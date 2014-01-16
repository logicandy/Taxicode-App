// Auto focus when click on labels in .field with matching form item
$(document).on("click", ".field label", function() {
	$(this).siblings("input, select, textarea").focus();
});