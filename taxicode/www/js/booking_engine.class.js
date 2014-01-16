var BookingEngine = {

	initialize : function() {

		$("#app").empty();

		$("#app").append("<input type='text' placeholder='Pickup' />");
		$("#app").append("<input type='text' placeholder='Destination' />");
		$("#app").append("<input type='text' placeholder='Vias - Optional' />");

		$("#app").append("<input type='datetime' />");
		$("#app").append("<input type='datetime' />");

	}

};
