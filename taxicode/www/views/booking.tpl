<div class="block">

	<h2>Journey</h2>

	<div class="fieldset">

		<div class="field">
			<label>Pickup</label>
			<input type="text" data-var="pickup" maxlength="100" />
		</div>

		<div class="field">
			<label>Destination</label>
			<input type="text" data-var="destination" maxlength="100" />
		</div>

		<!--<div class="field">
			<label>Vias</label>
			<input type="text" data-var="vias" maxlength="100" placeholder="Optional" />
		</div>-->

	</div>

	<input type="date" data-var="pickupDate" min="{{%new Date().format()}}" />
	<input type="time" data-var="pickupTime" />

	<select data-var="passengers">
		{{#foreach passengers}}
			<option value="{{$key}}">{{$value}}</option>
		{{#endforeach}}
	</select>

	<center><a class="btn" onclick="Booking.getQuote();">Get Quote</a></center>

</div>