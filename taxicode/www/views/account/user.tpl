<div class='block'>

	<p><center><img src='{picture}' /></center></p>

	<p><strong>Name:</strong> {{$name}}</p>
	<p><strong>Email:</strong> {{$email}}</p>
	{{#if User.user.company}}
		<p><strong>Company:</strong> {{$company}}</p>
	{{#endif}}

	<p>{{%Config.app}}</p>

	<p><a class='btn' data-action='logout'>Logout</a></p>

</div>