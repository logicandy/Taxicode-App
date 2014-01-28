var Config = {

	app: window.location.hash == "#tpc" ? "taxipricecompare" : "taxicode",
	title: window.location.hash == "#tpc" ? "Taxi Price Compare" : "Taxicode",

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
		api: "http://api:8888/",
		main: "http://taxicode:8888/",
		compare: "http://heathrow:8888/"
	},

	initialize: function(callback) {
		DBMC.select("SETTINGS", "*", false, function(rows) {
			$.each(rows, function(i, row) {
				Config.settings[row.setting] = row.value;
			});
			console.log(Config.settings);
			callback();
		}, function() {
			// No saved settings to load
			callback();
		});
	},

	save: function(success, failure) {
		DBMC.createTable("SETTINGS", "'setting' TEXT, 'value' TEXT", true, function() {
			var settings = [];
			$.each(Config.settings, function(setting, value) {
				settings.push({setting: setting, value: value});
			});
			console.log(settings);
			DBMC.insert("SETTINGS", settings, success, failure);
		}, failure, success);
	},

	settings: {
		// Defaults
		faqVersion: 0.1
	}

};