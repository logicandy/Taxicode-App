<form class="block pay" data-submit="Booking.pay.complete">

	<h2>Billing Name &amp; Address</h2>

	<div class="fieldset">

		<div class="field">
			<label>Name</label>
			<input type="text" maxlength="20" name="billing_first_name" data-required="true" data-type="billing_first_name" />
		</div>

		<div class="field">
			<label>Surname</label>
			<input type="text" maxlength="20" name="billing_surname" data-required="true" data-type="billing_surname" />
		</div>

		<div class="field">
			<label>Address 1</label>
			<input name="billing_address_1" type="text" maxlength="50" data-required="true" />
		</div>

		<div class="field">
			<label>Address 2</label>
			<input name="billing_address_2" type="text" maxlength="50" />
		</div>

		<div class="field">
			<label>Town/City</label>
			<input name="billing_town" type="text" maxlength="30" data-required="true" />
		</div>

		<div class="field">
			<label>Postcode</label>
			<input name="billing_postcode" type="text" maxlength="10" data-required="true" />
		</div>

		<div class="field">
			<label>Country</label>
			<select name="billing_country">
				{{#foreach Booking.form_data.countries}}
					<option value="{{$key}}">{{$val}}</option>
				{{#endforeach}}
			</select>
		</div>

		<div class="field us-field">
			<label>State</label>
			<select name="billing_state" data-required="$.visible(this);" data-value="$.visible(this)?$(this).val():''">
				<option value="">- Select State -</option>
				{{#foreach Booking.form_data.states}}
					<option value="{{$key}}">{{$val}}</option>
				{{#endforeach}}
			</select>
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'card');">Go Back</a>
		<input type="submit" class="block-section center" value="Next" />
	</div>
	
</div>