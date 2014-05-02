<form style="margin: -16px -15px -21px;" class="fieldset">

	{{#if Template.data.error}}
		<div style='color: #990000;'>{{$error}}</div>
	{{#endif}}

	<div class="field" style="width: 100%;">
		<label>Email</label>
		<input type="email" class="email" value="{{%Config.get("login_email", "")}}" />
	</div>

	<div class="field" style="width: 100%;">
		<label>Password</label>
		<input class="password" type="password" />
	</div>

</form>