<div class="fieldset">

	<div class="field">
		<label>Type</label><!--
	--><select name="card_type" data-required="true">
			<option value="">- Select Card -</option>
			{{#foreach Template.data.cards}}
				<option value="{{$val.code}}">{{$val.name}} {{#if Template.data.val.uplift}} (+&pound;{{%(Booking.quotes[Booking.quote].price * Template.data.val.uplift/100).toFixed(2)}}){{#endif}}</option>
			{{#endforeach}}
		</select>
	</div>

	<div class="field">
		<label>Number</label><!--
	--><input type="text" maxlength="20" placeholder="xxxx xxxx xxxx xxxx" name="card_number" data-required="true" data-type="cardnumber" />
	</div>

	<div class="field maestro-field">
		<label>Start</label><!--
	--><input type="text" data-type="month" maxlength="7" name="card_start" data-required="$.visible(this);" data-value="$.visible(this)?Booking.formatMonth($(this).val()):''"
				data-date-min="{{%new Date().getTime()-1000*60*60*24*365*10}}" data-date-max="{{%new Date().getTime()}}" />
	</div>

	<div class="field">
		<label>Expiry</label><!--
	--><input type="text" data-type="month" maxlength="7" name="card_expiry" data-required="true" data-value="Booking.formatMonth($(this).val())"
				data-date-min="{{%new Date().getTime()}}" data-date-max="{{%new Date().getTime()+1000*60*60*24*365*10}}" />
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