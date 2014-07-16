var Help = {

	FAQ: [],

	defaultFAQ: [
		{
			question: "How do I pay?",
			answer: "You can pay by credit/debit card by booking online or over the phone. We accept all major cards including American Express as payment. Some taxi companies will also accept cash bookings."
		},
		{
			question: "When do I need to book my taxi?",
			answer: "We need at least 1 hour notice for taxi journeys. If you need a booking sooner, we will still provide you quotes and phone numbers for companies that cover the area you're booking in."
		},
		{
			question: "Are there any time restrictions?",
			answer: "No, we operate 365 days a year, 7 days a week, 24 hours a day."
		},
		{
			question: "Will I receive confirmation of my journey?",
			answer: "When booking a taxi you will receive two separate emails. The first email confirms we have successfully received your payment and we are in the process of confirming your journey with our drivers. A second email will be sent to you confirming your journey has been booked in. If, in the unlikely situation your journey is not confirmed we will automatically cancel your booking giving you a refund and plenty of time to make alternative arrangements."
		},
		{
			question: "Do you provide a receipt?",
			answer: "We will email you a receipt with a booking reference and contact number by email."
		},
		{
			question: "What type of vehicles do you have?",
			answer: "Your vehicles are automatically chosen based to choose the cheapest way of fitting the amount of passengers you're booking for."
		},
		{
			question: "What is the 100% Customer Satisfaction - Money Back Guarantee?",
			answer: "If you book a taxi with us and you're not completely satisfied with the service, we will provide you with a refund. Money back guarantee applies to online bookings only. Complaints must be made within 48 days of the journey taking place. We reserve the right to modify or terminate this guarantee at any time. The company shall not have any liability under the guarantee if it suspects any fraud and/or wilful concealment in relation to the guarantee."
		},
		{
			question: "Do I need to have an account with you to book a taxi?",
			answer: "Having an account makes things quicker and easier to track, but you can book journeys without an account."
		},
		{
			question: "Can I book a vehicle with a child seat?",
			answer: "Should you require a car seat please provide details in the notes box when making your booking and we will endeavour to meet your requirements."
		},
		{
			question: "What is your cancellation policy?",
			answer: "You can cancel a booking right up until the day before the booking for free. You may be charged if you cancel your booking on the day. You will still be charged if you fail to meet the driver at the pickup point."
		},
		{
			question: "Am I charged if my flight is delayed?",
			answer: "No, we do not charge you any extra if your flight is delayed. We always check your arrival time before we dispatch your driver."
		},
		{
			question: "Where do I meet my driver when I land at the airport?",
			answer: "Your driver will be waiting for you in the arrivals area by the airport information desk, holding a 'meet & greet' board with your name clearly written on it. If you have provided your mobile number we will try and contact you if we have any difficulty finding you. Please take a note of our phone number so you can ring us should you need to."
		},
		{
			question: "What is " + Config.AppName + "?",
			answer: Config.title + " is the UK's premier provider of online taxi services working with over 100s of taxi providers to offer reliable and competitively priced travel services throughout the UK."
		},
		{
			question: "Are your drivers licensed?",
			answer: "Yes, it is required by UK Law that all taxi companies are licensed by the Public Carriage Office or Transport for London."
		}
	],

	initialize: function() {
		API.get("faq", {
			type: "GET",
			data: {platform: Config.platform, version: Config.settings.faqVersion, app: AppName},
			success: function(response) {
				if (response.faq) {
					Config.setting("faqVersion", response.version);
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
