<form class="block pay" data-submit="Views.render('booking', 'slide', 'card');">

	<h2>Your Details</h2>

	<div class="fieldset">

		<div class="field">
			<label>Name</label>
			<input type="text" maxlength="30" name="name" value="{{%typeof User.user.name == 'undefined' ? '' : User.user.name}}" data-required="true" />
		</div>

		<div class="field">
			<label>Email</label>
			<input type="email" maxlength="50" name="email" value="{{%typeof User.user.email == 'undefined' ? '' : User.user.email}}" data-required="true" />
		</div>

		<div class="field">
			<label>Telephone</label>
			<input type="tel" maxlength="20" name="telephone" data-required="true" data-type="telephone" />
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'quote');">Go Back</a>
		<input type="submit" class="block-section center" value="Next" />
	</div>

</form>