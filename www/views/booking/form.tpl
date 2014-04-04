<form class="block booking-engine" data-submit="Booking.getQuote();">

	<h2>Journey</h2>

	<div class="fieldset">

		<div class="field">
			<label>Pickup</label><!--
		--><input type="text" name="pickup" maxlength="100" data-required="true" />
		</div>

		<div class="field">
			<label>Destination</label><!--
		--><input type="text" name="destination" maxlength="100" data-required="true" />
		</div>

		<div class="field">
			<label>Date</label><!--
		--><input type="text" name="pickup_date" data-type="date" />
		</div>

		<div class="field">
			<label>Time</label><!--
		--><input type="text" name="pickup_time" data-type="time" />
		</div>

		<div class="field">
			<label>People</label><!--
		--><select name="passengers">
			{{#foreach data.passengers}}
				<option value="{{$key}}">{{$val}}</option>
			{{#endforeach}}
		</select>

		</div>

	</div>
	
	
	<center><input type="submit" class="btn" value="Get Quote" /></center>

</form>