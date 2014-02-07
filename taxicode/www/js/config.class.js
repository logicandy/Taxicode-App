var Config = {

	app: window.location.hash == "#tpc" ? "taxipricecompare" : "taxicode",
	title: window.location.hash == "#tpc" ? "Taxi Price Compare" : "Taxicode",
	subdir: window.location.hash == "#tpc" ? "tpc" : "taxicode",

	version: 0.1,

	mode: "developement",

	internalPing: 250,
	externalPing: 30000,

	ds: "/",

	dirs: {
		views: "views/",
		css: "css/",
		js: "js/"
	},

	country : 'United Kingdom',
	country_code : 'gb',

	domains: {
		api: "http://api.taxicode.com/",
		main: "http://www.taxicode.com/",
		compare: "https://www.taxipricecompare.co.uk/"
		/*api: "http://api:8888/",
		main: "http://taxicode:8888/",
		compare: "http://heathrow:8888/"*/
	},

	initialize: function(callback) {
		DBMC.select("SETTINGS", "*", false, function(rows) {
			$.each(rows, function(i, row) {
				Config.settings[row.setting] = row.value;
			});
			Config.loadPhoneGapConfig(callback);
		}, function() {
			// No saved settings to load
			Config.loadPhoneGapConfig(callback);
		});
	},

	loadPhoneGapConfig: function(callback) {
		$.ajax({
			url: "config.xml",
			success: function(data) {
				Config.phonegap = $(data);
			},
			complete: callback
		});
	},

	setting: function() {
		if (arguments.length == 2) {
			Config.settings[arguments[0]] = arguments[1];
			Config.save();
		} else if (typeof arguments[0] == "object") {
			$.each(arguments[0], function(key, val) {
				Config.settings[key] = val;
			});
			Config.save();
		} else {
			return Config.settings[arguments[0]];
		}
	},

	get: function(key, if_undefined) {
		var setting = Config.setting(key);
		return typeof setting == "undefined" ? if_undefined : setting;
	},

	set: function(key, value) {
		Config.setting(key, value);
	},

	remove: function(key) {
		delete Config.settings[key];
		Config.save();
	},

	save: function(success, failure) {
		DBMC.deleteTable("SETTINGS", function() {
			DBMC.createTable("SETTINGS", "'setting' TEXT, 'value' TEXT", true, function() {
				var settings = [];
				$.each(Config.settings, function(setting, value) {
					settings.push({setting: setting, value: value});
				});
				DBMC.insert("SETTINGS", settings, success, failure);
			}, failure, success);
		});
	},

	settings: {
		// Defaults
		faqVersion: 0.0
	}

};