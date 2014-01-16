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

	/**
	 * Renders the booking details in the booking engine
	 */
	renderEngine : function() {

		var $this = this;

		$("#app").empty();

		$("#app").append("<div class='field'><input type='text' placeholder='Pickup' data-var='pickup' /></div>");
		$("#app").append("<div class='field'><input type='text' placeholder='Destination' data-var='destination' /></div>");
		$("#app").append("<div class='field'><input type='text' placeholder='Vias - Optional' data-var='vias' /></div>");

		$("#app").append("<div class='field'></div>");
		$("#app").find(".field:last")
			.append("<input type='date' data-var='pickupDate' min='"+(new Date().format())+"' />")
			.append("<input type='time' data-var='pickupTime' />");

		$("#app").append("<div class='field'><select data-var='passengers'></select></div>");
		for (var i = 1; i <= 30; i++) {
			$("#app").find(".field:last select").append("<option value='"+i+"'>"+i+" Passenger"+(i>1?"s":"")+"</option>");
		}


		$("#app").append("<br/><div class='field'><a class='btn'>Get Quote</a></div>");

		$("[data-var]").each(function() {
			var key = $(this).attr('data-var');
			$(this).val($this[key]);
		});

		$("[data-var]").change(function() {
			var key = $(this).attr('data-var');
			$this[key] = $(this).val();
		});

	}

};
