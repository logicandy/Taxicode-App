<div class="block pay">

	<h2>Your Details</h2>

	<div class="fieldset">

		<div class="field">
			<label>Name</label>
			<input type="text" maxlength="30" value="{{%typeof User.user.name == 'undefined' ? '' : User.user.name}}" />
		</div>

		<div class="field">
			<label>Email</label>
			<input type="email" maxlength="50" value="{{%typeof User.user.email == 'undefined' ? '' : User.user.email}}" />
		</div>

		<div class="field">
			<label>Telephone</label>
			<input type="text" maxlength="20" />
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slideFromLeft', 'quote');">Go Back</a>
		<a class="block-section center" style="color: inherit;" onclick="Views.render('booking', 'slide', 'card');">Next</a>
	</div>

</div>