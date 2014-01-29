<div class="block">

	{{#if Booking.quotes.length == 0}}
		<h2>No Results</h2>
	{{#endif}}

	{{#if Booking.quotes.length}}

		<h2>Results</h2>

		{{#foreach Booking.quotes}}

			<div class="result" onclick="Booking.selectQuote({{$key}});">
				<div class="price">&pound;{{$val.price.toFixed(2)}}</div>
				<h3>{{$val.company_name}}</h3>
				<small>Based in {{$val.company_location}}</small>
				<div class="rating" data-score="{{$val.rating.score}}" data-ratings="{{$val.rating.ratings}}"></div>
			</div>

		{{#endforeach}}

	{{#endif}}

	<a class="result center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft');">Go Back</a>

</div>