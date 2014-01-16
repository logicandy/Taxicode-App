var App = {

	initialize : function() {

		var $this = this;

		if (typeof StatusBar != "undefined") {
			StatusBar.styleLightContent();
			StatusBar.backgroundColorByHexString("#1889D4");
		}

		$("#start-console").click(function() {
			$this.console();
		});
		
	},

	console : function() {
		$("#console").remove();
		$("#app").append("<div id='console'><input type='text' /></div>");
		$("#console input:text").change(function() {
			eval($("#console input:text").val());
		});
	}

}