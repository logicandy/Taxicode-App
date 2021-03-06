var Booking = {

	state: "form",
	data: {},

	quotes: false,
	journey: false,
	quote: false,

	initialize: function() {
		Booking.clear();
		Booking.getBookings();
		Booking.setupPostMessage();
	},

	startDate: function() {
		var coeff = 1000 * 60 * 5;
		return new Date(Math.ceil((new Date().getTime() + 1000*60*60*2) / coeff) * coeff - (new Date().getTimezoneOffset()) * 60000); 
	},

	clear: function() {
		var date = Booking.startDate();
		Booking.state = "form";
		Booking.data = {
			pickup: "",
			destination: "",
			vias: "",
			pickup_date: date.format("d/m/Y"),
			pickup_time: date.format("H:i"),
			"return": false,
			return_date: date.format("d/m/Y"),
			return_time: date.format("H:i"),
			passengers: 1,
			vehicle: 0
		};
		Booking.quote = false;
		Booking.quotes = false;
		Booking.journey = false;
		Booking.pay.data = {};
	},

	clearForm: function() {
		Booking.clear();
		Views.render('booking');
	},

	updateData: function() {
		$(".booking-engine [name]").each(function() {
			if ($(this).is("[data-lat][data-lng]")) {
				Booking.data[$(this).attr('name')] = {
					lat: parseFloat($(this).attr("data-lat")),
					lng: parseFloat($(this).attr("data-lng"))
				};
			} else {
				Booking.data[$(this).attr('name')] = Booking.formatDateTime($(this).val());
			}
		});

		if (!Booking.data["return"] || !$("[name=return_date]").val() || !$("[name=return_time]").val()) {
			Booking.data["return"] = false;
			Booking.data.return_date = false;
			Booking.data.return_time = false;
		}
	},

	formatDateTime: function(text) {
		if (text.match(/^[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/g)) {
			return text.substr(6, 4) + "-" + text.substr(3, 2) + "-" + text.substr(0, 2);
		}
		return text;
	},

	formatMonth: function (text) {
		if (text.match(/^[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/g)) {
			return text.substr(3, 4) + "-" + text.substr(0, 2);
		}
		return text;
	},

	getQuote: function() {
		Booking.updateData();
		App.loading("Fetching Quotes");

		var date = Booking.data.pickup_date + " " + Booking.data.pickup_time + ":00";
		var return_date = Booking.data["return"] ? Booking.data.return_date + " " + Booking.data.return_time  + ":00" : false;

		API.get("booking/quote", {
			data: {
				pickup: Booking.data.pickup,
				via: Booking.data.vias ? Booking.data.vias : false,
				destination: Booking.data.destination,
				date: date,
				"return": return_date,
				people: Booking.data.passengers,
				mode: Config.quote_mode,
				key: Config.api_key
			},
			success: function(response) {
				if (response.status == "OK") {
					Booking.quotes = response.quotes;
					Booking.numbers = response.numbers;
					Booking.journey = response.journey;
					Booking.form_data.card_types = response.card;
					Views.render('booking', 'slide', 'results');
				}
				App.stopLoading();
				Analytics.event("Booking", "Quote", "Quote For Journey Success", 1);
			},
			failure: function() {
				App.stopLoading();
				Analytics.event("Booking", "Quote", "Quote For Journey Failed", 0);
			}
		});
	},

	selectQuote: function(quote) {
		Booking.quote = quote;
		Views.render('booking', 'slide', 'quote');
	},

	validate: function(form) {
		switch (form) {
			case 'customer':
				App.element.find("");
				Views.render('booking', 'slide', 'card');
				break;
		}
	},

	validateQuoteForm: function() {
		Booking.updateData();

		var errors = [];

		if (Booking.data['return']) {
			var out = new Date(Booking.data.pickup_date+"T"+Booking.data.pickup_time).getTime();
			var re = new Date(Booking.data.return_date+"T"+Booking.data.return_time).getTime();
			if (out >= re) {
				errors.push({
					field: "Return",
					message: "Return date must be after pickup date."
				});
			}
		}

		return errors;
	},

	sortBookings: function(bookings, order) {
		// Set order
		order = order ? order : 'DESC';

		// Copy all bookings to array
		var sortable = [];
		$.each(bookings, function(key, value) {
			sortable.push(value);
		});

		// Sort array by the date
		sortable.sort(function(a, b) {
			return (new Date(a.date).getTime()) - (new Date(b.date).getTime());
		});

		// If order is DESC, reverse array;
		if (order.toUpperCase() == 'DESC') {
			sortable.reverse();
		}

		// Fill new object with booking object with reference as key
		var sorted = {};
		$.each(sortable, function(i, booking) {
			sorted[booking.reference] = booking;
		});
		return sorted;
		
	},

	details: function(booking) {
		Views.render('bookings', 'slide', Booking.bookings[booking] || User.bookings[booking]);
	},

	pay: {
		data: {},
		quote: function(type) {
			Booking.pay.data = {};
			switch (type) {
			case "token":
				Views.render('booking', 'slide', 'token');
				break;
			case "cash":
				Views.render('booking', 'slide', 'cash');
				break;
			case "balance":
				Views.render('booking', 'slide', 'balance');
				break;
			case "card":
			default:
				Views.render('booking', 'slide', 'customer');
				break;
			}
		},
		customer: function(data) {
			$.extend(Booking.pay.data, data);
			Config.setting(data);
			Views.render('booking', 'slide', 'card');
		},
		card: function(data) {
			$.extend(Booking.pay.data, data);
			Views.render('booking', 'slide', 'billing');
		},
		complete: function(data) {
			$.extend(Booking.pay.data, data);
			Config.setting(data);
			App.loading();
			Booking.pay.data.quote = Booking.quote;

			API.get("booking/pay", {
				data: $.extend({
					quote: Booking.quote,
					vehicle: Booking.data.vehicle,
					key: Config.api_key,
					secure: true,
					origin: window.location.origin,
				}, User.authObject(), Booking.pay.data),
				success: function(response) {
					Booking.pay.complete_success(response, 'customer');
				},
				complete: function() {
					App.stopLoading();
				}
			});
		},
		complete_token: function(data) {
			$.extend(Booking.pay.data, data);
			App.loading();
			API.get("booking/pay", {
				data: $.extend({quote: Booking.quote, vehicle: Booking.data.vehicle, key: Config.api_key}, User.authObject(), {
					method: "token",
					name: data.name,
					telephone: data.telephone,
					email: data.email,
					secure: true,
					origin: window.location.origin,
					CV2: data.CV2,
					notes: data.notes
				}),
				success: function(response) {
					Booking.pay.complete_success(response, 'token');
				},
				complete: function() {
					App.stopLoading();
				}
			});
		},
		complete_cash: function(data) {
			App.loading();
			API.get("booking/pay", {
				data: $.extend({quote: Booking.quote, vehicle: Booking.data.vehicle, key: Config.api_key}, User.authObject(), {
					method: "cash",
					name: data.name,
					telephone: data.telephone,
					email: data.email,
					notes: data.notes
				}),
				success: function(response) {
					Booking.pay.complete_success(response, 'cash');
				},
				complete: function() {
					App.stopLoading();
				}
			});
		},
		complete_balance: function(data) {
			App.loading();
			API.get("booking/pay", {
				data: $.extend({quote: Booking.quote, vehicle: Booking.data.vehicle, key: Config.api_key}, User.authObject(), {
					method: "balance",
					name: data.name,
					telephone: data.telephone,
					email: data.email,
					notes: data.notes
				}),
				success: function(response) {
					API.get("user", {
						data: User.authObject(),
						success: function(response) {
							if (response.status == "OK") {
								User.load(response.user, false);
							} else {
								User.state = false;
							}
							User.refreshView();
						},
						complete: function() {
							User.ready = true;
						}
					});
					Booking.pay.complete_success(response, 'balance');
				},
				complete: function() {
					App.stopLoading();
				}
			});
		},
		complete_success: function (response, fail_view) {
			switch (response.status) {
				case "3DAUTH":
					Analytics.event("Booking", "Booked", "3D Securing", 1);

					$("body").append("<div class='iframe-outer' id='3DAUTH'><iframe src='" + response.url + "'></iframe></div>");
					resizeIFrame();

					break;
				case "OK":
					Analytics.event("Booking", "Booked", "Booking Complete", 1);
					Booking.reference = response.reference;
					Booking.store();
					Booking.clear();
					Views.render('booking', 'slide', 'complete');
					break;
				default:
					Analytics.event("Booking", "Booked", "Booking Failed", 1);
					App.stopLoading();
					App.alert(response.error ? response.error : "Error taking payment. Please review your information.", {options: {OK: function() {
						$(this).closest('.alert').remove();
						Views.render('booking', fail_view == 'customer' ? 'slideFromLeft' : 'swap', fail_view);
					}}});
					break;
			}
		}
	},

	store: function() {
		Booking.bookings[Booking.reference] = {
			reference: Booking.reference,
			date: Booking.journey.date,
			"return": Booking.journey["return"],
			pickup: Booking.journey.pickup,
			destination: Booking.journey.destination,
			price: Booking.quotes[Booking.quote].price,
			distance: Booking.quotes[Booking.quote].distance,
			people: Booking.journey.people,
			company_name: Booking.quotes[Booking.quote].company_name,
			company_number: Booking.quotes[Booking.quote].company_phone,
			status: "Unconfirmed"
		};
		Booking.save();
	},

	save: function(type) {
		$.each(Booking.bookings, function(id, b) {
			Booking.bookings[id].pickup = JSON.stringify(b.pickup);
			Booking.bookings[id].destination = JSON.stringify(b.destination);
		});
		DBMC.createTable("BOOKINGS", "reference, date, return, pickup, destination, price, distance, people, company_name, company_number, status", true, function() {
			DBMC.insert("BOOKINGS", Booking.bookings, function() {
				Booking.getBookings();
			});
		});
	},

	saveUser: function() {
		$.each(User.bookings, function(id, b) {
			User.bookings[id].user = User.user.email;
//			User.bookings[id].pickup = JSON.stringify(b.pickup);
//			User.bookings[id].destination = JSON.stringify(b.destination);
		});
		DBMC.createTable("USER_BOOKINGS", "user, reference, date, return, pickup, destination, price, distance, people, company_name, company_number, status", true, function() {
			DBMC.insert("USER_BOOKINGS", User.bookings, function() {
				Booking.getUserBookings(User.user.email);
			});
		});
	},

	checkBookings: function(success, failure) {
		API.get("booking/state", {
			data: {booking: $.map($.extend({}, Booking.bookings, User.bookings), function(b) {
				return b.reference;
			}).join(",")},
			type: "GET",
			success: function(response) {
				if (success) {
					success();
				}
				if (response.status == "OK") {
					$.each(response.bookings, function(ref, booking) {
						if (booking.status && booking.company_name) {
							if (Booking.bookings[ref]) {
								Booking.bookings[ref].status = booking.status;
								Booking.bookings[ref].company_name = booking.company_name;
								Booking.bookings[ref].company_number = booking.company_telephone;
							}
							if (User.bookings && User.bookings[ref]) {
								User.bookings[ref].status = booking.status;
								User.bookings[ref].company_name = booking.company_name;
								User.bookings[ref].company_number = booking.company_telephone;
							}
						}
					});
					Booking.save();
				}
			},
			failure: function() {
				if (failure) {
					failure();
				}
			}
		});
	},

	bookings: {},
	getBookings: function() {
		DBMC.select("BOOKINGS", "*", false, function(bookings) {
			Booking.bookings = {};
			console.log(bookings);
			for (var i = 0; i < bookings.length; i++) {
				Booking.bookings[bookings[i].reference] = $.extend({}, bookings[i], {
					pickup: JSON.parse(bookings[i].pickup),
					destination: JSON.parse(bookings[i].destination)
				});
			}
		});
	},

	getUserBookings: function(email, success) {
		DBMC.select("USER_BOOKINGS", "*", "user='" + email + "'", function(bookings) {
			console.log("BOOKINGS", arguments);
			User.bookings = {};
			for (var i = 0; i < bookings.length; i++) {
				User.bookings[bookings[i].reference] = $.extend({}, bookings[i], {
					pickup: JSON.parse(bookings[i].pickup),
					destination: JSON.parse(bookings[i].destination)
				});
			}
			//if (success) {
			//	success();
			//}
		});
		if (success) {
			success();
		}
	},

	form_data: {
		countries: {
			GB : 'United Kingdom',
			AF : 'Afghanistan',
			AX : 'Aland Islands',
			AL : 'Albania',
			DZ : 'Algeria',
			AS : 'American Samoa',
			AD : 'Andorra',
			AO : 'Angola',
			AI : 'Anguilla',
			AQ : 'Antarctica',
			AG : 'Antigua and Barbuda',
			AR : 'Argentina',
			AM : 'Armenia',
			AW : 'Aruba',
			AU : 'Australia',
			AT : 'Austria',
			AZ : 'Azerbaijan',
			BS : 'Bahamas',
			BH : 'Bahrain',
			BD : 'Bangladesh',
			BB : 'Barbados',
			BY : 'Belarus',
			BE : 'Belgium',
			BZ : 'Belize',
			BJ : 'Benin',
			BM : 'Bermuda',
			BT : 'Bhutan',
			BO : 'Bolivia',
			BA : 'Bosnia and Herzegovina',
			BW : 'Botswana',
			BV : 'Bouvet Island',
			BR : 'Brazil',
			IO : 'British Indian Ocean Territory',
			BN : 'Brunei Darussalam',
			BG : 'Bulgaria',
			BF : 'Burkina Faso',
			BI : 'Burundi',
			KH : 'Cambodia',
			CM : 'Cameroon',
			CA : 'Canada',
			CV : 'Cape Verde',
			KY : 'Cayman Islands',
			CF : 'Central African Republic',
			TD : 'Chad',
			CL : 'Chile',
			CN : 'China',
			CX : 'Christmas Island',
			CC : 'Cocos (Keeling) Islands',
			CO : 'Colombia',
			KM : 'Comoros',
			CG : 'Congo',
			CD : 'Congo, The Democratic Republic of the',
			CK : 'Cook Islands',
			CR : 'Costa Rica',
			CI : 'C&ocirc;te d\'Ivoire',
			HR : 'Croatia',
			CU : 'Cuba',
			CY : 'Cyprus',
			CZ : 'Czech Republic',
			DK : 'Denmark',
			DJ : 'Djibouti',
			DM : 'Dominica',
			DO : 'Dominican Republic',
			EC : 'Ecuador',
			EG : 'Egypt',
			SV : 'El Salvador',
			GQ : 'Equatorial Guinea',
			ER : 'Eritrea',
			EE : 'Estonia',
			ET : 'Ethiopia',
			FK : 'Falkland Islands (Malvinas)',
			FO : 'Faroe Islands',
			FJ : 'Fiji',
			FI : 'Finland',
			FR : 'France',
			GF : 'French Guiana',
			PF : 'French Polynesia',
			TF : 'French Southern Territories',
			GA : 'Gabon',
			GM : 'Gambia',
			GE : 'Georgia',
			DE : 'Germany',
			GH : 'Ghana',
			GI : 'Gibraltar',
			GR : 'Greece',
			GL : 'Greenland',
			GD : 'Grenada',
			GP : 'Guadeloupe',
			GU : 'Guam',
			GT : 'Guatemala',
			GG : 'Guernsey',
			GN : 'Guinea',
			GW : 'Guinea-Bissau',
			GY : 'Guyana',
			HT : 'Haiti',
			HM : 'Heard Island and McDonald Islands',
			VA : 'Holy See (Vatican City State)',
			HN : 'Honduras',
			HK : 'Hong Kong',
			HU : 'Hungary',
			IS : 'Iceland',
			IN : 'India',
			ID : 'Indonesia',
			IR : 'Iran, Islamic Republic of',
			IQ : 'Iraq',
			IE : 'Ireland',
			IM : 'Isle of Man',
			IL : 'Israel',
			IT : 'Italy',
			JM : 'Jamaica',
			JP : 'Japan',
			JE : 'Jersey',
			JO : 'Jordan',
			KZ : 'Kazakhstan',
			KE : 'Kenya',
			KI : 'Kiribati',
			KP : 'Korea, Democratic People\'s Republic of',
			KR : 'Korea, Republic of',
			KW : 'Kuwait',
			KG : 'Kyrgyzstan',
			LA : 'Lao People\'s Democratic Republic',
			LV : 'Latvia',
			LB : 'Lebanon',
			LS : 'Lesotho',
			LR : 'Liberia',
			LY : 'Libyan Arab Jamahiriya',
			LI : 'Liechtenstein',
			LT : 'Lithuania',
			LU : 'Luxembourg',
			MO : 'Macao',
			MK : 'Macedonia, The Former Yugoslav Republic of',
			MG : 'Madagascar',
			MW : 'Malawi',
			MY : 'Malaysia',
			MV : 'Maldives',
			ML : 'Mali',
			MT : 'Malta',
			MH : 'Marshall Islands',
			MQ : 'Martinique',
			MR : 'Mauritania',
			MU : 'Mauritius',
			YT : 'Mayotte',
			MX : 'Mexico',
			FM : 'Micronesia, Federated States of',
			MD : 'Moldova',
			MC : 'Monaco',
			MN : 'Mongolia',
			ME : 'Montenegro',
			MS : 'Montserrat',
			MA : 'Morocco',
			MZ : 'Mozambique',
			MM : 'Myanmar',
			NA : 'Namibia',
			NR : 'Nauru',
			NP : 'Nepal',
			NL : 'Netherlands',
			AN : 'Netherlands Antilles',
			NC : 'New Caledonia',
			NZ : 'New Zealand',
			NI : 'Nicaragua',
			NE : 'Niger',
			NG : 'Nigeria',
			NU : 'Niue',
			NF : 'Norfolk Island',
			MP : 'Northern Mariana Islands',
			NO : 'Norway',
			OM : 'Oman',
			PK : 'Pakistan',
			PW : 'Palau',
			PS : 'Palestinian Territory, Occupied',
			PA : 'Panama',
			PG : 'Papua New Guinea',
			PY : 'Paraguay',
			PE : 'Peru',
			PH : 'Philippines',
			PN : 'Pitcairn',
			PL : 'Poland',
			PT : 'Portugal',
			PR : 'Puerto Rico',
			QA : 'Qatar',
			RE : 'Réunion',
			RO : 'Romania',
			RU : 'Russian Federation',
			RW : 'Rwanda',
			BL : 'Saint Barthélemy',
			SH : 'Saint Helena',
			KN : 'Saint Kitts and Nevis',
			LC : 'Saint Lucia',
			MF : 'Saint Martin',
			PM : 'Saint Pierre and Miquelon',
			VC : 'Saint Vincent and the Grenadines',
			WS : 'Samoa',
			SM : 'San Marino',
			ST : 'Sao Tome and Principe',
			SA : 'Saudi Arabia',
			SN : 'Senegal',
			RS : 'Serbia',
			SC : 'Seychelles',
			SL : 'Sierra Leone',
			SG : 'Singapore',
			SK : 'Slovakia',
			SI : 'Slovenia',
			SB : 'Solomon Islands',
			SO : 'Somalia',
			ZA : 'South Africa',
			GS : 'South Georgia and the South Sandwich Islands',
			ES : 'Spain',
			LK : 'Sri Lanka',
			SD : 'Sudan',
			SR : 'Suriname',
			SJ : 'Svalbard and Jan Mayen',
			SZ : 'Swaziland',
			SE : 'Sweden',
			CH : 'Switzerland',
			SY : 'Syrian Arab Republic',
			TW : 'Taiwan, Province of China',
			TJ : 'Tajikistan',
			TZ : 'Tanzania, United Republic of',
			TH : 'Thailand',
			TL : 'Timor-Leste',
			TG : 'Togo',
			TK : 'Tokelau',
			TO : 'Tonga',
			TT : 'Trinidad and Tobago',
			TN : 'Tunisia',
			TR : 'Turkey',
			TM : 'Turkmenistan',
			TC : 'Turks and Caicos Islands',
			TV : 'Tuvalu',
			UG : 'Uganda',
			UA : 'Ukraine',
			AE : 'United Arab Emirates',
			GB : 'United Kingdom',
			US : 'United States',
			UM : 'United States Minor Outlying Islands',
			UY : 'Uruguay',
			UZ : 'Uzbekistan',
			VU : 'Vanuatu',
			VE : 'Venezuela',
			VN : 'Viet Nam',
			VG : 'Virgin Islands, British',
			VI : 'Virgin Islands, U.S.',
			WF : 'Wallis and Futuna',
			EH : 'Western Sahara',
			YE : 'Yemen',
			ZM : 'Zambia',
			ZW : 'Zimbabwe'
		},
		states: {
			AL : 'Alabama',
			AK : 'Alaska',
			AZ : 'Arizona',
			AR : 'Arkansas',
			CA : 'California',
			CO : 'Colorado',
			CT : 'Connecticut',
			DE : 'Delaware',
			DC : 'District Of Columbia',
			FL : 'Florida',
			GA : 'Georgia',
			HI : 'Hawaii',
			ID : 'Idaho',
			IL : 'Illinois',
			IN : 'Indiana',
			IA : 'Iowa',
			KS : 'Kansas',
			KY : 'Kentucky',
			LA : 'Louisiana',
			ME : 'Maine',
			MD : 'Maryland',
			MA : 'Massachusetts',
			MI : 'Michigan',
			MN : 'Minnesota',
			MS : 'Mississippi',
			MO : 'Missouri',
			MT : 'Montana',
			NE : 'Nebraska',
			NV : 'Nevada',
			NH : 'New Hampshire',
			NJ : 'New Jersey',
			NM : 'New Mexico',
			NY : 'New York',
			NC : 'North Carolina',
			ND : 'North Dakota',
			OH : 'Ohio',
			OK : 'Oklahoma',
			OR : 'Oregon',
			PA : 'Pennsylvania',
			RI : 'Rhode Island',
			SC : 'South Carolina',
			SD : 'South Dakota',
			TN : 'Tennessee',
			TX : 'Texas',
			UT : 'Utah',
			VT : 'Vermont',
			VA : 'Virginia',
			WA : 'Washington',
			WV : 'West Virginia',
			WI : 'Wisconsin',
			WY : 'Wyoming'
		},
		card_types: false
	},

	// Function and setup to allow cross origin iFrame communcation
	// Currently used primarily for 3D secure payments.
	setupPostMessageComplete: false,
	setupPostMessage: function() {
		if (!Booking.setupPostMessageComplete) {
			// Function that will process the message
			var processMessage = function (event) {
				// Get api domain name and remove trailing /
				var domain = Config.domains.api;
				if (domain.substr(-1) == '/') {
					domain = domain.substr(0, domain.length - 1);
				}
				// Check API domain matches the message origin
		    	if (event.origin.replace("https", "http") == domain.replace("https", "http")) {
		    		// Decode the JSON response
		    		var response = $.parseJSON(event.data);
		    		// Check what message has been responded
		    		switch (response.message) {
		    			case "3DAUTH":
		    				// If 3DAUTH message, remove the popup iframe and complete the booking payment
		    				$("#3DAUTH").remove();
		    				Booking.pay.complete_success(response, 'customer');
		    				break;
		    		}
				}
			};
			// Attach the proccess message function to the window
			if (window.addEventListener) {
				window.addEventListener("message", processMessage, false);
			} else {
				window.attachEvent("onmessage", processMessage, false);
			}
			// Mark as setup so this doesn't run twice
			Booking.setupPostMessageComplete = true;
		}
	}

};

Booking.initialize();
