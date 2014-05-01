<form class="block" data-submit="User.login">
	<h2>Login</h2>

	<div class='fieldset'>
		<div class='field'><label>Email</label><input type='email' name='email' value='{{%Template.data.email||Config.get("login_email","")}}'/></div>
		<div class='field'><label>Password</label><input type='password' name='password' /></div>
	</div>

	<center><input class='btn' type='submit' value='Login' /></center>
</form>