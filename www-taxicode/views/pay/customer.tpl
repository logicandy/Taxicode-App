<form class="block pay" data-submit="Booking.pay.customer">

	<h2>
		{{#if !User.user}}
			<a class="btn small fright" onclick="User.loginPopup(function(){Views.render('booking', undefined, 'customer')});">Login</a>
		{{#endif}}
		Your Details
	</h2>

	<div class="fieldset">

		<div class="field">
			<label>Name</label><!--
		--><input type="text" maxlength="30" name="name" data-required="true" />
		</div>

		<div class="field">
			<label>Email</label><!--
		--><input type="email" maxlength="50" name="email" data-required="true" />
		</div>

		<div class="field">
			<label>Telephone</label><!--
		--><input type="tel" maxlength="20" name="telephone" data-required="true"/>
		</div>

		<div class="field">
			<label>Notes<div class="max-chars" data-for="notes"></div></label><!--
		--><textarea type="text" maxlength="50" name="notes" placeholder="Journey Notes (optional)"></textarea>
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'quote');">Go Back</a><!--
		--><input type="submit" class="block-section center" value="Next" />
	</div>

</form>