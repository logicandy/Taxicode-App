var Help = {

	FAQ: [],

	defaultFAQ: [
		{
			question: "What is the money back guarantee?",
			answer: "At Taxicode we only pick the best taxi operators to use our booking system. If you're not 100% completely satisfied with your taxi experience, contact us and we will arrange a full refund for you. Our money back guarantee applies to online bookings only."
		},
		{
			question: "Will I receive a confirmation email?",
			answer: "Yes, you will receive two emails, the first confirming your booking and the second when the taxi company has recieved your job."
		}
	],

	initialize: function() {
		API.get("faq", {
			type: "GET",
			data: {platform: Config.platform, version: Config.settings.faqVersion},
			success: function(response) {
				if (response.faq) {
					Config.settings.faqVersion = response.version;
					Config.save();
					Help.FAQ = response.faq;
					Help.updateFAQdb();
					Help.ready = true;
				} else {
					Help.loadFAQ();
				}
			},
			failure: Help.loadFAQ
		});
	},

	loadFAQ: function() {
		DBMC.select("FAQ", "*", false, function(rows) {
			Help.FAQ = rows;
			Help.ready = true;
		}, function() {
			Help.FAQ = Help.defaultFAQ;
			Help.updateFAQdb();
			Help.ready = true;
		});
	},

	updateFAQdb: function() {
		DBMC.createTable("FAQ", "question TEXT, answer TEXT", true, function() {
			DBMC.insert("FAQ", Help.FAQ)
		});
	},

	test: function() {
		this.getFAQ(function(success) {
			console.log('error:', success);
		}, function(error) {
			console.log('error:', error);
		});
	}

};
