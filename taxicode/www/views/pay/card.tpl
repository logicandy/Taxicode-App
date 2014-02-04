<div class="block pay">

	<h2>Card Details</h2>

	<div class="fieldset">

		<div class="center" style="padding: 0px 8px;">
			<select>
				<option>- Select Card -</option>
				{{#foreach Booking.form_data.card_types}}
					<option value="{{$val.code}}">
						{{$val.name}}
						{{#if Template.data.val.uplift}}
							(+&pound;{{%(Booking.quotes[Booking.quote].price * Template.data.val.uplift/100).toFixed(2)}})
						{{#endif}}
					</option>
				{{#endforeach}}
			</select>
		</div>

		<div class="field">
			<label>Number</label>
			<input type="text" maxlength="20" placeholder="xxxx xxxx xxxx xxxx" />
		</div>

		<div class="field">
			<label>Expiry</label>
			<input type="month" maxlength="7" />
		</div>

		<div class="field">
			<label>CV2 <span class="help" data-help="">?</span></label>
			<input type="text" maxlength="3" placeholder="xxx" />
		</div>

	</div>
	

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center" onclick="Views.render('booking', 'slideFromLeft', 'customer');">Go Back</a>
		<a class="block-section center disabled" onclick="Views.render('booking', 'slide', 'billing');">Next</a>
	</div>

</div>