<form class="block" data-submit="User.verify">

	<h2>Verify</h2>

	<p>Thank you for registering!</p>
	<p>Please enter the verification code we've text you.</p>

	<div class="fieldset">
		<div class="field"><label>Email</label><input type="email" name="email" data-required="true" value="{{%User.verifyEmail?User.verifyEmail:''}}" /></div>
		<div class="field"><label>Code</label><input type="number" name="verify" data-requiref="true" /></div>
	</div>

	<center><input type="submit" class="btn" value="Verify Account" /></center>

	<br/><hr/><br/>

	<center><a class='btn small' data-action='back'>Back</a></center><br/>

</form>