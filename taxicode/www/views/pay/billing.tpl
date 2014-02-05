<div class="block pay">

	<h2>Billing Address</h2>

	<div class="fieldset">

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

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'card');">Go Back</a>
		<a class="block-section center" onclick="Views.render('booking', 'slideFromLeft', 'billing');">Next</a>
	</div>
	
</div>