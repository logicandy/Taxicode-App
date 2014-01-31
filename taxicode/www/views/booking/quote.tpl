<div class="block quote">

	<div class="map"
		data-pickup="{{$journey.pickup.position[0]}},{{$journey.pickup.position[1]}}"
		data-destination="{{$journey.destination.position[0]}},{{$journey.destination.position[1]}}"
		style="height: 160px;"
	></div>

	<div class="price center">&pound;{{$quote.price.toFixed(2)}}</div>

	<table class="info">
		<tr>
			<td>Pickup</td>
			<td>{{$journey.pickup.string}}</td>
		</tr>
		<tr>
			<td>Destination</td>
			<td>{{$journey.destination.string}}</td>
		</tr>
		<tr>
			<td>Distance</td>
			<td>{{$journey.distance}} miles</td>
		</tr>
		<tr>
			<td>People</td>
			<td>{{$journey.people}}</td>
		</tr>
		<tr>
			<td>Date</td>
			<td>{{$journey.date}}</td>
		</tr>
	</table>

	<p class="center"><a class="btn" onclick="Booking.pay('card');">Pay By Card</a></p>
	
	{{#if Template.data.quote.company_phone}}
		<p class="center"><a class="btn" href="tel:{{$quote.company_phone}}">Call {{$quote.company_name}}</a></p>
	{{#endif}}

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft','results');">Go Back</a>

</div>