<div class="refresh-pull">

	{{#if false && (Object.size(Booking.bookings) || Object.size(User.bookings))}}
		<div class="refresh-icon"><img src="img/loading.gif" /></div>
	{{#endif}}
	
	<div class="block">

		<h2>Bookings</h2>

		{{#if !Object.size(Booking.bookings) && !Object.size(User.bookings)}}
			<p class="center">You have no bookings. Once you've made some bookings or logged in you will see your bookings here.</p>

			<!-- Try one of these -->
			<p class="center"><a class="btn" data-render="booking">Make A Booking</a></p>
			{{%User.user ? "" : "<p class='center'><a class='btn' data-render='account'>Login / Create Account</a></p>"}}

		{{#endif}}

		{{#foreach Booking.sortBookings($.extend({},User.bookings,Booking.bookings))}}
			<div class="block-section" onclick="Booking.details('{{$key}}');">

				<div class="fright">

					<div class="iblock">
						{{#if Template.data.val['return'] && Template.data.val['return'] != "false"}}
							<div class="calendar-date-name">Out</div>
						{{#endif}}
						<div class="calendar" style="margin-left: 5px; margin-bottom: 5px;">
							<span class="month">{{%(new Date(Template.data.val.date.replace(/\ /g, 'T')).format('M \'y'))}}</span>
							<span class="date">{{%(new Date(Template.data.val.date.replace(/\ /g, 'T')).format('j'))}}</span>
							<span class="time">{{%(new Date(Template.data.val.date.replace(/\ /g, 'T')).format('g:ia'))}}</span>
						</div>
					</div>

					<div class="iblock">
						{{#if Template.data.val['return'] && Template.data.val['return'] != "false"}}
							<div class="calendar-date-name">Return</div>
							<div class="calendar return" style="margin-left: 5px; margin-bottom: 5px;">
								<span class="month">{{%(new Date(Template.data.val['return'].replace(/\ /g, 'T')).format('M \'y'))}}</span>
								<span class="date">{{%(new Date(Template.data.val['return'].replace(/\ /g, 'T')).format('j'))}}</span>
								<span class="time">{{%(new Date(Template.data.val['return'].replace(/\ /g, 'T')).format('g:ia'))}}</span>
							</div>
						{{#endif}}
					</div>

				</div>

				<h3>{{$val.reference}}</h3>

				<div class="location-text"><strong>Status:</strong> {{$val.status}}</div>
				<div class="location-text"><strong>From:</strong> {{$val.pickup.string}}</div>
				<div class="location-text"><strong>To:</strong> {{$val.destination.string}}</div>
			</div>
		{{#endforeach}}

	</div>
</div>