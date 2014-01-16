var App = {

	initialize : function() {

		if (typeof StatusBar != "undefined") {
			StatusBar.backgroundColorByHexString("#1889D4");
		}

		$("#start-console").click(function() {
			this.console;
		});
		
	},

	console : function() {
		$("#app").append("<input type='text' />");
		$("#app").append("<input type='submit' />");
		$("#app input:submit").click(function() {
			eval($("#app input:text").val());
		});
	}

}