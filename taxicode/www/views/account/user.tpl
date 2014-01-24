<div class='block center'>

	{{#if User.user.picture}}
		<p><center><img src='{{$picture}}' class="user-picture" /></center></p>
	{{#endif}}

	<p><strong>Name:</strong> {{$name}}</p>
	<p><strong>Email:</strong> {{$email}}</p>
	{{#if User.user.company}}
		<p><strong>Company:</strong> {{$company}}</p>
	{{#endif}}

	<p><a class='btn' data-action='logout'>Logout</a></p>

</div>