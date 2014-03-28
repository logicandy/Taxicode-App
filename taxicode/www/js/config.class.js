var Params = window.location.search ? JSON.parse('{"' + decodeURI(window.location.search.substr(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {};

var Config = {

	app:		Params.app == "tpc" ? "taxipricecompare" : "taxicode",
	title:		Params.app == "tpc" ? "Taxi Price Compare" : "Taxicode",
	quote_mode:	Params.app == "tpc" ? "all" : "tc",
	subdir:		Params.app == "tpc" ? "tpc" : "taxicode",

	demo: Params.demo,

	theme: Params.theme == "android" ? "android" : "ios7",

	version: 0.1,

	mode: DevMode ? "developement" : "production",

	internalPing: 1000 * 0.25, // 0.25 seconds
	externalPing: 1000 * 30, // 30 seconds

	ds: "/",

	dirs: {
		views: "views/",
		css: "css/",
		js: "js/"
	},

	cards: {
		VISA: {code: 'VISA', name: 'Visa Credit'},
		DELTA: {code: 'DELTA', name: 'Visa Debit'},
		UKE: {code: 'UKE', name: 'Visa Electron'},
		MC: {code: 'MC', name: 'MasterCard'},
		MAESTRO: {code: 'MAESTRO', name: 'Maestro'},
		AMEX: {code: 'AMEX', name: 'American Express'}
	},

	google_analytics_id: "UA-49481876-1",

	country : 'United Kingdom',
	country_code : 'gb',

	domains: DevMode ? {
		api: "https://api:8890/",
		main: "http://taxicode:8888/",
		compare: "http://heathrow:8888/"
	} : {
		api: "https://api.taxicode.com/",
		main: "http://www.taxicode.com/",
		compare: "https://www.taxipricecompare.co.uk/"
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