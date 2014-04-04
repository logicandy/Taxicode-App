<form class="block" data-submit="User.changePassword">

	<h2>Change Password</h2>

	<div class="fieldset">

		<div class="field">
			<label>Current</label><!--
		--><input type="password" name="current" data-required="true" />
		</div>

		<br/>

		<div class="field">
			<label>New</label><!--
		--><input type="password" name="password" data-required="true" />
		</div>

		<div class="field">
			<label>Confirm</label><!--
		--><input type="password" name="password2" data-required="true" />
		</div>

	</div>

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.back();">Go Back</a><!--
		--><input type="submit" class="block-section center" value="Change" />
	</div>

</form>