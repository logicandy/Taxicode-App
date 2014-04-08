<div class='block'>

	<h2>Login</h2>

	<div class='fieldset'>
		<div class='field'><label>Email</label><input type='email' value='{{%Template.data.email||Config.get("login_email","")}}'/></div>
		<div class='field'><label>Password</label><input type='password' /></div>
	</div>

	<center><a class='btn' data-action='login'>Login</a></center>

</div>

<br/>

<center><a class='btn small' data-action='create'>Create Account</a></center><br/>
<center><a class='btn small' data-action='verify'>Verify Account</a></center>
