<div class="block quote">

	<div class="map"
		data-pickup="{{$journey.pickup.position[0]}},{{$journey.pickup.position[1]}}"
		data-destination="{{$journey.destination.position[0]}},{{$journey.destination.position[1]}}"
		style="height: 160px;"
	></div>

	<div id="quote-price" class="price center">&pound;{{$quote.price.toFixed(2)}}</div>

	<!--<select id="vehicles-list">
		{{#foreach Booking.quotes[Booking.quote].vehicles}}
			<option value="{{$key}}">{{$val.count}} &times; {{$val.name}} (&pound;{{$val.price.toFixed(2)}})</option>
		{{#endforeach}}
	</select>-->
	
	<br/>

	<div class="center">

		<a class="btn double" onclick="Booking.pay.quote('card');">
			<span>New Card</span>
			<small>Credit/Debit</small>
		</a>

		{{#if User.user && User.user.card_token}}
			<a class="btn double" onclick="Booking.pay.quote('token');">
				<span>Saved Card</span>
				<small>Ending {{%User.user.card_token.digits}}</small>
			</a>
		{{#endif}}

		{{#if User.user && $.inArray("CASH", Booking.quotes[Booking.quote].payment_options) > -1}}
			<a class="btn double" onclick="Booking.pay.quote('cash');">
				<span>By Cash</span>
				<small>To The Driver</small>
			</a>
		{{#endif}}

		{{#if !User.user && $.inArray("CASH", Booking.quotes[Booking.quote].payment_options) > -1}}
			<p>Logged in users can pay by cash.</p>
		{{#endif}}
		{{#if !User.user}}
			<p><a class="btn small" onclick="User.loginPopup(function(){Views.render('booking', undefined, 'quote')});">Login</a></p>
		{{#endif}}

	</div>

	<br/>

	<div class="full">
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
				<td>
					{{%new Date(Template.data.journey.date.replace(/\ /g, 'T')).format('D, jS M Y \\a\\t g:ia')}}
				</td>
			</tr>
		</table>
	</div>
	
	<!--
		{{#if Template.data.quote.company_phone}}
			<p class="center"><a class="btn" href="tel:{{$quote.company_phone}}">Call {{$quote.company_name}}</a></p>
		{{#endif}}
	-->

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft','results');">Go Back</a>

</div>