<form class="block pay" data-submit="Booking.pay.card">

	<h2>Card Details</h2>

	<div class="fieldset">

		<div class="center" style="padding: 0px 8px;">
			<select name="card_type" data-required="true">
				<option value="">- Select Card -</option>
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
			<label>Number</label><!--
		--><input type="text" maxlength="20" placeholder="xxxx xxxx xxxx xxxx" name="card_number" data-required="true" data-type="cardnumber" />
		</div>

		<div class="field maestro-field">
			<label>Start</label><!--
		--><input type="month" maxlength="7" name="card_start" data-required="$.visible(this);" min="{{%new Date().format('Y-m')}}" data-value="$.visible(this)?$(this).val():''" />
		</div>

		<div class="field">
			<label>Expiry</label><!--
		--><input type="month" maxlength="7" name="card_expiry" data-required="true" min="{{%new Date().format('Y-m')}}" />
		</div>

		<div class="field maestro-field">
			<label>Issue No.</label><!--
		--><input type="text" maxlength="2" name="issue_number" data-value="$.visible(this)?$(this).val():''" />
		</div>

		<div class="field">
			<label>CV2 <span class="help" data-help="The CV2 code is the last 3 digits on the back of your card normally found in the signature strip.">?</span></label><!--
		--><input type="text" maxlength="3" placeholder="xxx" name="CV2" data-type="cv2" />
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'customer');">Go Back</a><!--
		--><input type="submit" class="block-section center" value="Next" />
	</div>

</div>