var Config = {

	app:		AppName == "tpc" ? "taxipricecompare" : "taxicode",
	title:		AppName == "tpc" ? "Taxi Price Compare" : "Taxicode",
	quote_mode:	AppName == "tpc" ? "all" : "tc",
	subdir:		AppName == "tpc" ? "tpc" : "taxicode",
	api_key:	AppName == "tpc" ? "NwwFTcF6VVHmCg6k" : "drVbTNgnZT3JaqeE",

	demo: Params.demo,

	theme: Params.theme == "android" ? "android" : "ios7",

	version: 0.3,

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
		api: "http://api.local/",
		main: "http://taxicode.local/",
		compare: "http://compare.local/"
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
			if (typeof callback == "function") {
				callback();
			}
		}, callback);
		
		// Adjust theme
		if (typeof device == "object" && device.platform && device.platform.toLowerCase) {
			switch (device.platform.toLowerCase()) {
				case "android":
					Config.theme = "android";
					break;
				case "wince":
				case "windows":
				case "windowsphone":
				case "windows8":
					Config.theme = "wp";
					break;
				case "ios":
				default:
					Config.theme = "ios7";
					break;
			}
		}
		
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

switch (AppName) {
	case "tpc":
		Config.app = "taxipricecompare";
		Config.title = "Taxi Price Compare";
		Config.quote_mode = "all";
		Config.subdir = "tpc";
		Config.api_key = "NwwFTcF6VVHmCg6k";
		break;
	case "aa":
		Config.app = "aa";
		Config.title = "AA Taxis";
		Config.quote_mode = "all";
		Config.subdir = "aa";
		Config.api_key = "AJaRdn234As3kn0d";
		break;
	case "trip":
		Config.app = "trip";
		Config.title = "Trip";
		Config.quote_mode = "all";
		Config.subdir = "trip";
		Config.api_key = "Dq580rTxHUvzN4ed";
		break;
	case "taxicode": case "tc": default:
		Config.app = "taxicode";
		Config.title = "Taxicode";
		Config.quote_mode = "tc";
		Config.subdir = "taxicode";
		Config.api_key = "drVbTNgnZT3JaqeE";
		break;
}
