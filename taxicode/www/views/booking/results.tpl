<div class="block">

	{{#if Booking.quotes.length == 0}}
		<h2 class="center">No Results</h2>
	{{#endif}}

	{{#if Object.size(Booking.quotes) && Object.size(Booking.quotes) <= 1}}
		<h2>Results</h2>
	{{#endif}}

	{{#if Object.size(Booking.quotes) && Object.size(Booking.quotes) > 1}}
		<h2>
			<select class="fright" id="sort-results">
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
					<h3>
						{{%User.user && User.user.companies[Template.data[Template.data.key].company_id]?"<img src='img/star_orange.png' class='star' />":""}}
						{{$val.company_name}}
					</h3>
					<small>Based in {{$val.company_location}}</small>
					<div class="rating" data-score="{{$val.rating.score}}" data-ratings="{{$val.rating.ratings}}"></div>
					<small>Reliability: {{$val.reliability}}/10</small>

					<!-- Starred company -->
					<div><strong>{{%User.user && User.user.companies[Template.data[Template.data.key].company_id]?"<small>You've successfully booked with "+Template.data[Template.data.key].company_name+" before.</small>":""}}</strong></div>
				</div>

			{{#endforeach}}

		</div>

	{{#endif}}

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft','form');">Go Back</a>

</div>