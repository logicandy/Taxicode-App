<form class="block booking-engine" data-submit="Booking.getQuote();">

	<h2>Journey</h2>

	<div class="fieldset">

		<div class="field">
			<label>Pickup</label>
			<input type="text" name="pickup" maxlength="100" data-required="true" />
		</div>

		<div class="field">
			<label>Destination</label>
			<input type="text" name="destination" maxlength="100" data-required="true" />
		</div>

	</div>

	<center>
		<input type="date" name="pickup_date" min="{{%new Date().format()}}" /><!--
		--><input type="time" name="pickup_time" />
	</center>
	
	<select name="passengers">
		{{#foreach data.passengers}}
			<option value="{{$key}}">{{$val}}</option>
		{{#endforeach}}
	</select>

	<center><input type="submit" class="btn" value="Get Quote" /></center>

</form>