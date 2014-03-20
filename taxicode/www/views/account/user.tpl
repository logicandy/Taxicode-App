<div class='block center'>

	<h2>{{$name}}</h2>

	{{#if User.user.picture}}
		<p><img src='{{$picture}}' class="user-picture" /></p>
	{{#endif}}

	{{#if User.user.company}}<h3>{{$company}}</h3>{{#endif}}
	<h3>{{$email}}</h3>

	<div>

		<div class="info-block">
			<span>Total Bookings</span>
			<div>{{$total_bookings}}</div>
		</div>

		<div class="info-block">
			<span>Current Bookings</span>
			<div>{{$current_bookings}}</div>
		</div>

	</div>

	<hr/>

	<p><a class="btn">Remove Payment Card</a></p>
	<p><a class="btn">Change Password</a></p>


	<!-- Recently Used Companies List -->
	{{#if Object.size(User.user.companies)}}
		<hr/>
		<h3>Recently Used Companies</h3>
		{{#foreach2 User.user.companies}}
			<a class="block-section" href="tel:{{$val.phone.replace(/\ /g,'');}}" style="text-decoration: none;">
				<span class="fright btn small" style="margin-left: 10px; margin-top: -5px;">{{$val.phone}}</span>
				{{$val}}
			</a>
		{{#endforeach2}}

	{{#endif}}

</div>