<div class="block">

	<h2>Bookings</h2>

	{{#if !Object.size(Booking.bookings)}}
		<p class="center">You have no bookings. Once you've made some bookings or logged in you will see your bookings here.</p>
	{{#endif}}

	{{#foreach Booking.bookings}}
		<div class="block-section" onclick="Views.render('bookings', 'slide', '{{$key}}');">

			<div class="calendar fright" style="margin-left: 5px; margin-bottom: 5px;">
				<span class="month">{{%(new Date(Template.data.val.date).format('M \'y'))}}</span>
				<span class="date">{{%(new Date(Template.data.val.date).format('j'))}}</span>
				<span class="time">{{%(new Date(Template.data.val.date).format('g:ia'))}}</span>
			</div>

			<h3>{{$val.reference}}</h3>

			<div class="location-text"><strong>From:</strong> {{$val.pickup.string}}</div>
			<div class="location-text"><strong>To:</strong> {{$val.destination.string}}</div>
		</div>

	{{#endforeach}}

</div>