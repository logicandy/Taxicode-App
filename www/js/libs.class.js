var Libs = {

	ready: false,
	timeout: 5000,

	libraries: {
		google: {
			url: "https://www.google.com/jsapi",
			success: function() {
				google.load("maps", "3", {other_params: 'libraries=places&sensor=false', callback: function() {
					Libs.checkReady();
				}});
			},
			ready: function() {
				return window.google && window.google.maps && window.google.maps.places ? true : false;
			}
		}
	},

	initialize: function() {
		$.each(Libs.libraries, function(name, library) {
			Libs.load(name);
		});
		Libs.checkReadyRepeat();
	},

	load: function(library) {
		// DOESN'T WORK AS AJAX DOESN'T KNOW IF SCRIPT FAILED
		if (!Libs.libraries[library].ready()) {
			setTimeout(Libs.load, Libs.timeout, library);
			$.ajax({
				url: Libs.libraries[library].url,
				dataType: "script",
				success: function() {
					console.log("Loaded library: "+library);
					Libs.libraries[library].success();
				}
			});
		}
	},

	checkReady: function(library) {
		var r = true;
		$.each(Libs.libraries, function(name, library) {
			if (!library.ready()) {
				r = false;
				return false;
			}
		});
		Libs.ready = r;
	},

	checkReadyRepeat: function() {
		if (!Libs.ready) {
			Libs.checkReady();
			setTimeout(Libs.checkReadyRepeat, Config.internalPing);
		}
	}

};