<div class="block">

	{{#if Booking.quotes.length == 0 && Booking.numbers.length == 0}}
		<h2 class="center">No Results</h2>
	{{#endif}}

	{{#if Booking.quotes.length == 0 && Booking.numbers.length != 0}}
		<h2 class="center">Nearby Company Numbers</h2>
		<div id="results">

			<div class="block-section" style="background: white !important; cursor: default;"><strong>We currently don't have coverage for your jounrey. Here are the numbers of some local taxi firms that may be able to provide you with service</strong></div>

			{{#foreach Booking.numbers}}
				<a class="block-section" href="tel:{{$val.phone.replace(/\ /g,'');}}" style="text-decoration: none;">
					<span class="fright btn small" style="margin-left: 10px; margin-top: -5px;">{{$val.phone}}</span>
					{{$val.company}}
				</a>
			{{#endforeach}}
		</div>
	{{#endif}}

	{{#if Object.size(Booking.quotes) && Object.size(Booking.quotes) <= 1}}
		<h2>Results</h2>
	{{#endif}}

	{{#if Object.size(Booking.quotes) && Object.size(Booking.quotes) > 1}}
		<h2>
			<select class="fright" id="sort-results">
				{{%Config.app=="taxicode"?"":"<option value='reliability'>Sort By Reliability</option>"}}
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
					<div class="price">
						<div>&pound;{{$val.price.toFixed(2)}}</div>
						{{%$.inArray("CASH", Template.data[Template.data.key].payment_options)>-1?"<div class='cash'>Pay By Card Or Cash</div>":"<div class='cash'>Pay By Card Only</div>"}}
					</div>
					<h3>
						{{%User.user && User.user.companies[Template.data[Template.data.key].company_id]?"<img src='img/star_orange.png' class='star' />":""}}
						{{$val.company_name}}
					</h3>
					<small>Based in {{$val.company_location}}</small>
					<div class="rating" data-score="{{$val.rating.score}}" data-ratings="{{$val.rating.ratings}}"></div>
					{{%Config.app=="taxicode"?"":"<small>Reliability: "+Template.data[Template.data.key].reliability+"/10</small>"}}

					<!-- Starred company -->
					<div><strong>{{%User.user && User.user.companies[Template.data[Template.data.key].company_id]?"<small>You've successfully booked with "+Template.data[Template.data.key].company_name+" before.</small>":""}}</strong></div>
				</div>

			{{#endforeach}}

		</div>

	{{#endif}}

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking','slideFromLeft','form');">Go Back</a>

</div>