<div class="block">

	<h2>Bookings</h2>

	<table>
		{{#foreach Booking.bookings}}
			<tr>
				<td>{{$val.reference}}</td>
				<td>{{$val.date}}</td>
				<td>{{$val.pickup.string}}</td>
				<td>{{$val.destination.string}}</td>
			</tr>
		{{#endforeach}}
	</table>

</div>