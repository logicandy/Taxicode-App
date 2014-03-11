<div class='block center'>

	{{#if User.user.picture}}
		<p><center><img src='{{$picture}}' class="user-picture" /></center></p>
	{{#endif}}

	<p><strong>Name:</strong> {{$name}}</p>
	<p><strong>Email:</strong> {{$email}}</p>
	{{#if User.user.company}}
		<p><strong>Company:</strong> {{$company}}</p>
	{{#endif}}


	{{#if Object.size(User.user.companies)}}
		<hr/>
		<h3>Favourite Companies</h3>
		{{#foreach User.user.companies}}
			<div>{{$val}}</div>
		{{#endforeach}}
	{{#endif}}

	<p><a class='btn' data-action='logout'>Logout</a></p>

</div>