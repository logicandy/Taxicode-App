var Booking = {

	layout: 1,

	state: "form",

	data: {
		pickup: "",
		destination: "",
		vias: "",

		pickup_date: (new Date().format()),
		pickup_time: "12:00",

		returnDate: false,
		returnTime: false,

		passengers: 1
	},
	quotes: false,
	journey: false,
	quote: false,

	updateData: function() {
		$(".booking-engine [name]").each(function() {
			Booking.data[$(this).attr('name')] = $(this).val();
		});
	},

	getQuote: function() {
		Booking.updateData();
		App.loading();
		API.get("booking/quote", {
			data: {
				pickup: Booking.data.pickup,
				destination: Booking.data.destination,
				date: new Date(Booking.data.pickup_date+" "+Booking.data.pickup_time).getTime()/1000,
				people: Booking.data.passengers	
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

	pay: {
		data: {},
		quote: function(type) {
			Booking.pay.data = {};
			Views.render('booking', 'slide', 'customer');
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

			/*API.get("booking/pay", {
				data: {
					quote: Booking.quote,
					name: "Josh Thompson"
					email: "josh3276@gmail.com"
					telephone: "07986 726202"
					card_holder: ---------------------
					card_type:


					CV2: "123"
					billing_address_1: "88"
					billing_address_2: ""
					billing_country: "GB"
					billing_postcode: "412"
					billing_state: ""
					billing_town: "Test Town"
					card_expiry: "2014-12"
					card_number: "4462000000000003"
					card_start: ""
					card_type: "DELTA"
					issue_number: ""
					quote: "9010855C97640EBA93F74416B1295192"


				}
			});*/
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
	}

};
