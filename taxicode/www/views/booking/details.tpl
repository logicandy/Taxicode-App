<div class="block quote">

	<h2 class="center">Reference: {{%Booking.bookings[Template.data.booking].reference}}</h2>

	<div class="map"
		data-pickup="{{%Booking.bookings[Template.data.booking].pickup.position[0]}},{{%Booking.bookings[Template.data.booking].pickup.position[1]}}"
		data-destination="{{%Booking.bookings[Template.data.booking].destination.position[0]}},{{%Booking.bookings[Template.data.booking].destination.position[1]}}"
		style="height: 160px; margin-top: 5px;"
	></div>

	<div class="price center">&pound;{{%Booking.bookings[Template.data.booking].price.toFixed(2)}}</div>

	<div class="full">
		<table class="info">
			<tr>
				<td>Status</td>
				<td>{{%Booking.bookings[Template.data.booking].status}}</td>
			</tr>
			<tr>
				<td>Company</td>
				<td>
					{{%Booking.bookings[Template.data.booking].company_name}}
					{{#if Booking.bookings[Template.data.booking].company_number}}
						<br/><a class="" href="tel:{{%Booking.bookings[Template.data.booking].company_number}}">{{%Booking.bookings[Template.data.booking].company_number}}</a>
					{{#endif}}
				</td>
			</tr>
			<tr>
				<td>Pickup</td>
				<td>{{%Booking.bookings[Template.data.booking].pickup.string}}</td>
			</tr>
			<tr>
				<td>Destination</td>
				<td>{{%Booking.bookings[Template.data.booking].destination.string}}</td>
			</tr>
			<tr>
				<td>People</td>
				<td>{{%Booking.bookings[Template.data.booking].people}}</td>
			</tr>
			<tr>
				<td>Date</td>
				<td>
					{{%new Date(Booking.bookings[Template.data.booking].date).format('D, jS M Y \\a\\t g:ia')}}
				</td>
			</tr>
		</table>
	</div>

	<a class="block-section center" style="color: inherit;" onclick="Views.render('bookings','slideFromLeft');">Go Back</a>

</div>