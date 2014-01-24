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

	updateData: function() {
		$(".booking-engine [data-var]").each(function() {
			Booking.data[$(this).attr('data-var')] = $(this).val();
		});
	},

	getQuote: function() {
		Booking.updateData();
		API.get("booking/quote", {
			data: {
				pickup: Booking.data.pickup,
				destination: Booking.data.destination,
				date: Booking.data.pickupDate+" "+Booking.data.pickupTime,
				people: Booking.data.passengers	
			}
		});
	}

};
