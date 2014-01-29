var Booking = {

	layout: 1,

	data: {
		pickup: "",
		destination: "",
		vias: "",

		pickupDate: (new Date().format()),
		pickupTime: "12:00",

		returnDate: false,
		returnTime: false,

		passengers: 1
	},

	quotes: false,
	journey: false,
	quote: false,

	updateData: function() {
		$(".booking-engine [data-var]").each(function() {
			Booking.data[$(this).attr('data-var')] = $(this).val();
		});
	},

	getQuote: function() {
		Booking.updateData();
		App.loading();
		API.get("booking/quote", {
			data: {
				pickup: Booking.data.pickup,
				destination: Booking.data.destination,
				date: new Date(Booking.data.pickupDate+" "+Booking.data.pickupTime).getTime()/1000,
				people: Booking.data.passengers	
			},
			success: function(response) {
				if (response.status == "OK") {
					Booking.quotes = response.quotes;
					Booking.journey = response.journey;
					Views.render('booking','slide','results');
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
	}

};
