<div class="block quote">

	<h2 class="center">Reference: {{%Template.data.booking.reference}}</h2>

	<div class="map"
		data-pickup="{{%Template.data.booking.pickup.position[0]}},{{%Template.data.booking.pickup.position[1]}}"
		data-destination="{{%Template.data.booking.destination.position[0]}},{{%Template.data.booking.destination.position[1]}}"
		style="height: 160px; margin-top: 5px;"
	></div>

	<div class="price center">&pound;{{%Template.data.booking.price.toFixed(2)}}</div>

	<div class="full">
		<table class="info">
			<tr>
				<td>Status</td>
				<td>{{%Template.data.booking.status}}</td>
			</tr>
			<tr>
				<td>Company</td>
				<td>
					{{%Template.data.booking.company_name}}
					{{#if Template.data.booking.company_number != "false" && Template.data.booking.company_number != null}}
						<br/><a class="" href="tel:{{%Template.data.booking.company_number}}">{{%Template.data.booking.company_number}}</a>
					{{#endif}}
				</td>
			</tr>
			<tr>
				<td>Pickup</td>
				<td>{{%Template.data.booking.pickup.string}}</td>
			</tr>
			<tr>
				<td>Destination</td>
				<td>{{%Template.data.booking.destination.string}}</td>
			</tr>
			<tr>
				<td>People</td>
				<td>{{%Template.data.booking.people}}</td>
			</tr>
			<tr>
				<td>Date</td>
				<td>
					{{%new Date(Template.data.booking.date.replace(/\ /g, 'T')).format('D, jS M Y \\a\\t g:ia')}}
				</td>
			</tr>
		</table>
	</div>

	<p class="center">
		<a class="btn rebook-journey">Rebook Journey</a>
	</p>

	<p class="center">
		<a class="btn resend-booking">Resend Booking Receipt</a>
	</p>

	<a class="block-section center" style="color: inherit;" onclick="Views.render('bookings','slideFromLeft');">Go Back</a>

</div>