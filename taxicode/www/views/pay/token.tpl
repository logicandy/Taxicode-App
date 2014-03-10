<form class="block pay" data-submit="Booking.pay.complete_token">

	<h2>Confirm Card</h2>

	<p>The card currently connected to your account ends <span class="card">{{%User.user.card_token.digits}}</span>.</p>

	<div class="fieldset">

		<div class="field">
			<label>CV2 <span class="help" data-help="The CV2 code is the last 3 digits on the back of your card normally found in the signature strip.">?</span></label><!--
		--><input type="text" maxlength="3" placeholder="xxx" name="CV2" data-type="cv2" />
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'quote');">Go Back</a><!--
		--><input type="submit" class="block-section center" value="Complete" />
	</div>

</div>