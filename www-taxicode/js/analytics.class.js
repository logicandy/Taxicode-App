var Analytics = {

	gaPlugin: false,

	setup: function() {
		return;
		if (window.plugins && window.plugins.gaPlugin) {
			Analytics.gaPlugin = window.plugins.gaPlugin;
			Analytics.gaPlugin.init(
				function() {
					// Success
					console.log("Analytics Init: SUCCESS");
				},
				function() {
					// Failure
					console.log("Analytics Init: FAILED");
				},
				Config.google_analytics_id,
				Config.externalPing / 1000
			);
		} else {
			console.log("Google Analytics Plugin doesn't exist.");
		}
	},

	event: function(category, type, label, value, success, failure) {
		if (Analytics.gaPlugin) {
			success = success ? success : function() {};
			failure = failure ? failure : function() {};
			Analytics.gaPlugin.trackEvent(success, failure, category, type, label, value);
		}
	}

};