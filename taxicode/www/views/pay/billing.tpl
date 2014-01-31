<div class="block pay">

	<div class="fieldset">

		<h3>Billing Address</h3>

		<div class="field">
			<label>Address 1</label>
			<input type="text" maxlength="50" />
		</div>

		<div class="field">
			<label>Address 2</label>
			<input type="text" maxlength="50" />
		</div>

		<div class="field">
			<label>Town/City</label>
			<input type="text" maxlength="30" />
		</div>

		<div class="field">
			<label>Postcode</label>
			<input type="text" maxlength="10" />
		</div>

		<div class="field">
			<label>Country</label>
			<select>
				{{#foreach Booking.form_data.countries}}
					<option value="{{$key}}">{{$val}}</option>
				{{#endforeach}}
			</select>
		</div>

	</div>

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slideFromLeft', 'card');">Go Back</a>
	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slideFromLeft', 'billing');">Next</a>

</div>