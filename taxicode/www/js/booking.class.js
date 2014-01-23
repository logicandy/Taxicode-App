var Booking = {

	/**
	 * Booking instance vars
	 */

	pickup: "",
	destination: "",
	vias: "",

	pickupDate: (new Date().format()),
	pickupTime: "12:00",

	returnDate: false,
	returnTime: false,

	passengers: 1,

	getQuote: function() {
		API.get("booking", {
			data: {
				pickup: Booking.pickup,
				destination: Booking.destination,
				date: Booking.pickupDate+" "+Booking.pickupTime,
				people: Booking.passengers	
			}
		});
	}

};
