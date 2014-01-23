var Config = {

	app: window.location.hash == "#tpc" ? "taxipricecompare" : "taxicode",
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
	}

};