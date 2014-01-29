<div class="block quote">

	<div class="map"
		data-pickup="{{$journey.pickup.position[0]}},{{$journey.pickup.position[1]}}"
		data-destination="{{$journey.destination.position[0]}},{{$journey.destination.position[1]}}"
		style="height: 160px;"
	></div>

	<div class="price center">&pound;{{$quote.price.toFixed(2)}}</div>

	<p><strong>Pickup:</strong> {{$journey.pickup.string}}</p>
	<p><strong>Destination:</strong> {{$journey.destination.string}}</p>
	<p><strong>Distance:</strong> {{$journey.distance}} miles</p>

	<p class="center"><a class="btn">Pay By Card</a></p>
	<p class="center"><a class="btn">Call {{$quote.company_name}}</a></p>

	<a class="result center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft','results');">Go Back</a>

</div>