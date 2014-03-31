<form class="block" data-submit="User.create">

	<h2>Create Account</h2>

	<div class="fieldset">
		<div class="field"><label>First Name</label><input type="text" name="first_name" data-required="true" /></div>
		<div class="field"><label>Last Name</label><input type="text" name="last_name" data-required="true" /></div>
		<div class="field"><label>Email</label><input type="email" name="email" data-required="true" /></div>
		<div class="field"><label>Telephone</label><input type="tel" name="phone" /></div>
	</div>

	<div class="fieldset">
		<div class="field"><label>Password</label><input type="password" name="password" data-required="true" /></div>
		<div class="field"><label>Confirm</label><input type="password" name="password2" /></div>
	</div>

	<center><input type="submit" class="btn" value="Create" /></center>

	<br/><hr/><br/>

	<center><a class='btn small' data-action='back'>Back</a></center><br/>

</form>