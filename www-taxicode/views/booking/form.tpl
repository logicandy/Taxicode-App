{{#if Config.get("tooltips") !== "off"}}
	<div class="block tool-tip" data-tooltip="0">
		<div class="close fright">&times;</div>
		<div class="inner">
			<span>{{%App.tooltips[0]}}</span>
		</div>
	</div>
{{#endif}}

<!--<div class="tablet-columns">
	<div class="tablet-columns-inner">-->

		<form class="block booking-engine" data-validate="Booking.validateQuoteForm()" data-submit="Booking.getQuote();">

			<h2>
				<a class="btn small fright" onclick="Booking.clearForm();">Clear</a>
				Journey
			</h2>

			<div class="fieldset">

				<div class="field">
					<label>Pickup</label><!--
				--><input type="text" name="pickup" maxlength="100" data-required="true" />
				</div>

				<!--<div class="field">
					<label>Via</label>--><!--
				--><!--<input type="text" name="vias" maxlength="100" data-required="false" />
				</div>-->

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

				<div class="field">
					<a class="add-return">+ Add Return Journey</a>
				</div>

				<div class="field return-field">
					<label>Return</label><input type="text" name="return_date" data-type="date" />
				</div>

				<div class="field return-field">
					<label>Time</label><input type="text" name="return_time" data-type="time" />
				</div>

			</div>
			
			
			<center class="hide"><input type="submit" class="btn online" value="Get Quote" /></center>
			<center><a class="btn online btn-ink" onclick="$(this).closest('form').submit();">Get Quote</a></center>

		</form>

		<!--<div class="block map" data-lat="54" data-lng="-1.5" data-zoom="5" data-marker="false" style="height: 160px; width: 50%;"></div>-->

<!--	</div>
</div>-->