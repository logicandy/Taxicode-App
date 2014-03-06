<div class="block">

	{{#if Booking.quotes.length == 0}}
		<h2 class="center">No Results</h2>
	{{#endif}}

	{{#if Object.size(Booking.quotes) && Object.size(Booking.quotes) <= 1}}
		<h2>Results</h2>
	{{#endif}}

	{{#if Object.size(Booking.quotes) && Object.size(Booking.quotes) > 1}}
		<h2>
			<select class="fright" style="width: auto;" id="sort-results">
				<option value="reliability">Sort By Reliability</option>
				<option value="price">Sort By Price</option>
				<option value="feedback">Sort By Feedback</option>
			</select>

			Results
		</h2>
	{{#endif}}

	{{#if Object.size(Booking.quotes)}}

		<div id="results">

			{{#foreach Booking.quotes}}

				<div
					class="block-section result"
					onclick="Booking.selectQuote('{{$key}}');"
					data-price="{{$val.price}}"
					data-reliability="{{$val.reliability}}"
					data-rating="{{$val.rating.score}}"
					data-no-ratings="{{$val.rating.ratings}}"
				>
					<div class="price">&pound;{{$val.price.toFixed(2)}}</div>
					<h3>{{$val.company_name}}</h3>
					<small>Based in {{$val.company_location}}</small>
					<div class="rating" data-score="{{$val.rating.score}}" data-ratings="{{$val.rating.ratings}}"></div>
					<small>Reliability: {{$val.reliability}}/10</small>
				</div>

			{{#endforeach}}

		</div>

	{{#endif}}

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft','form');">Go Back</a>

</div>