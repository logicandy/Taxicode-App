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

	autocomplete: function() {
	}

};
