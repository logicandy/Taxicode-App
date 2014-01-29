{{#if Booking.layout == 1}}

	<div class="block booking-engine">

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

		<center>
			<input type="date" data-var="pickupDate" min="{{%new Date().format()}}" />
			<input type="time" data-var="pickupTime" />
		</center>
		
		<select data-var="passengers">
			{{#foreach data.passengers}}
				<option value="{{$key}}">{{$val}}</option>
			{{#endforeach}}
		</select>

		<center><a class="btn" onclick="Booking.getQuote();">Get Quote</a></center>

	</div>

{{#endif}}

{{#if Booking.layout == 2}}

	<div class="booking-engine">

		<div class="field"><input type="text" placeholder="Pickup" data-var="pickup" /></div>
		<div class="field"><input type="text" placeholder="Destination" data-var="destination" /></div>
		<div class="field"><input type="text" placeholder="Vias - Optional" data-var="vias" /></div>

		<div class="field center">
			<input type="date" data-var="pickupDate" min="{{%new Date().format()}}" />
			<input type="time" data-var="pickupTime" />
		</div>

		<div class="field">
			<select data-var="passengers">
				{{#foreach data.passengers}}
					<option value="{{$key}}">{{$val}}</option>
				{{#endforeach}}
			</select>
		</div>

		<br/>

		<div class="field center">
			<a class="btn" onclick="Booking.getQuote();">Get Quote</a>
		</div>

	</div>

{{#endif}}