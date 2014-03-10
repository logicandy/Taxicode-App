var Booking = {

	layout: 1,

	state: "form",
	data: {},

	quotes: false,
	journey: false,
	quote: false,

	initialize: function() {
		Booking.clear();
		Booking.getBookings();
	},

	clear: function() {
		Booking.data = {
			pickup: "",
			destination: "",
			vias: "",
			pickup_date: (new Date(new Date().getTime()+1000*60*60*24).format("d/m/Y")),
			pickup_time: "12:00",
			returnDate: false,
			returnTime: false,
			passengers: 1
		};
		Booking.quote = false;
		Booking.quotes = false;
		Booking.journey = false;
		Booking.pay.data = {}
	},

	updateData: function() {
		$(".booking-engine [name]").each(function() {
			Booking.data[$(this).attr('name')] = Booking.formatDateTime($(this).val());
		});
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
		App.loading();
		API.get("booking/quote", {
			data: {
				pickup: Booking.data.pickup,
				destination: Booking.data.destination,
				date: new Date(Booking.data.pickup_date+" "+Booking.data.pickup_time).getTime()/1000,
				people: Booking.data.passengers,
				mode: Config.quote_mode,
			},
			success: function(response) {
				if (response.status == "OK") {
					Booking.quotes = response.quotes;
					Booking.journey = response.journey;
					Booking.form_data.card_types = response.card;
					Views.render('booking', 'slide', 'results');
				}
				App.stopLoading();
			},
			failure: function() {
				App.stopLoading();
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
		complete_token: function(data) {
			return false;
			API.get("booking/pay", {
				data: $.extend({quote: Booking.quote}, User.authObject(), {
					method: "token",
					CV2: data.CV2
				}),
				success: Booking.pay.complete_success,
				complete: function() {
					App.stopLoading();
				}
			});
		},
		complete: function(data) {
			$.extend(Booking.pay.data, data);
			Config.setting(data);
			App.loading();
			Booking.pay.data.quote = Booking.quote;

			API.get("booking/pay", {
				data: $.extend({quote: Booking.quote}, User.authObject(), Booking.pay.data),
				success: Booking.pay.complete_success,
				complete: function() {
					App.stopLoading();
				}
			});
		},
		complete_success: function (response) {
			if (response.status == "OK") {
				Booking.reference = response.reference;
				Booking.store();
				Booking.clear();
				Views.render('booking', 'slide', 'complete');
			} else {
				App.stopLoading();
				App.alert(response.error ? response.error : "Error taking payment. Please review your information.", {options: {OK: function() {
					$(this).closest('.alert').remove();
					Views.render('booking', 'slideFromLeft', 'customer');
				}}});
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
			User.bookings[id].pickup = JSON.stringify(b.pickup);
			User.bookings[id].destination = JSON.stringify(b.destination);
		});
		DBMC.createTable("USER_BOOKINGS", "user, reference, date, return, pickup, destination, price, distance, people, company_name, company_number, status", true, function() {
			DBMC.insert("USER_BOOKINGS", User.bookings, function() {
				Booking.getUserBookings(User.user.email);
			});
		});
	},

	checkBookings: function() {
		API.get("booking/state", {
			data: {booking: $.map(Booking.bookings, function(b) {
				return b.reference;
			}).join(",")},
			type: "GET",
			success: function(response) {
				if (response.status == "OK") {
					$.each(response.bookings, function(ref, booking) {
						Booking.bookings[ref].status = booking.status.title;
						Booking.bookings[ref].company_name = booking.company_name;
						Booking.bookings[ref].company_number = booking.company_telephone;
					});
					Booking.save();
				}
			}
		});
	},

	bookings: {},
	getBookings: function() {
		DBMC.select("BOOKINGS", "*", false, function(bookings) {
			Booking.bookings = {};
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
			User.bookings = {};
			for (var i = 0; i < bookings.length; i++) {
				User.bookings[bookings[i].reference] = $.extend({}, bookings[i], {
					pickup: JSON.parse(bookings[i].pickup),
					destination: JSON.parse(bookings[i].destination)
				});
			}
			if (success) {
				success();
			}
		});
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
	}

};

Booking.initialize();
