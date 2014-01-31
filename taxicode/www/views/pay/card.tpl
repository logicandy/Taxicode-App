<div class="block pay">

	<h2>Card Details</h2>

	<div class="fieldset">

		<div class="center">
			<select>
				{{#foreach Booking.form_data.card_types}}
					<option value="{{$key}}">{{$val}}</option>
				{{#endforeach}}
			</select>
		</div>

		<div class="field">
			<label>Number</label>
			<input type="text" maxlength="20" />
		</div>

		<div class="field">
			<label>Expiry</label>
			<input type="month" maxlength="7" />
		</div>

		<div class="field">
			<label>CV2</label>
			<input type="text" maxlength="3" />
		</div>

	</div>
	

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slideFromLeft', 'customer');">Go Back</a>
		<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slide', 'billing');">Next</a>
	</div>

</div>