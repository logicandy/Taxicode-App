var Libs = {

	ready: false,

	libraries: {
		googlemaps: {
			url: "https://maps.googleapis.com/maps/api/js?libraries=places&amp;sensor=true",
			ready: false
			// Potentially add variable to specify whether library is required or not
		}
	},

	initialize: function() {
		$.each(Libs.libraries, function(name, library) {
			Libs.load(name);
		});
		Libs.ready = true; // Needs to be removed
	},

	load: function(library) {
		// DOESN'T WORK AS AJAX DOESN'T KNOW IF SCRIPT FAILED
		if (!Libs.libraries[library].ready) {
			$.ajax({
				url: Libs.libraries[library].url,
				dataType: "script",
				success: function() {
					console.log("Loaded library: "+library);
					Libs.libraries[library].ready = true;
					Libs.checkReady();
				},
				failure: function() {
					console.error("Failed loading library: "+library);
					setTimeout(Libs.load, Config.internalPing, library);
				}
			});
		}
	},

	checkReady: function(library) {
		var r = true;
		$.each(Libs.libraries, function(name, library) {
			if (!library.ready) {
				r = false;
				return false;
			}
		});
		Libs.ready = r;
	}

};