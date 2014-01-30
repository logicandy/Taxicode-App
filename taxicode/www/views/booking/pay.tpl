<div class="block pay">

	<h2>Pay</h2>

	<div class="fieldset">

		<h3>Your Details</h3>

		<div class="field">
			<label>Name</label>
			<input type="text" maxlength="30" />
		</div>

		<div class="field">
			<label>Email</label>
			<input type="email" maxlength="50" />
		</div>

		<div class="field">
			<label>Telephone</label>
			<input type="text" maxlength="20" />
		</div>

	</div>
	
	<div class="fieldset">

		<h3>Card Details</h3>

		<div class="field">
			<label>Type</label>
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

	<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slideFromLeft', 'quote');">Go Back</a>

</div>