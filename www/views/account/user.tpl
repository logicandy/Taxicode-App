<div class='block center'>

	<h2>{{$name}}</h2>

	{{#if User.user.picture && App.connected}}
		<p><img src='{{$picture}}' class="user-picture" /></p>
	{{#endif}}

	{{#if User.user.company}}<h3>{{$company}}</h3>{{#endif}}
	<h3>{{$email}}</h3>

	<div>

		<div class="info-block" data-render="bookings">
			<span>Total Bookings</span>
			<div>{{%User.user.bookings_totals.total}}</div>
		</div>

		<div class="info-block" data-render="bookings">
			<span>Current Bookings</span>
			<div>{{%User.user.bookings_totals.current}}</div>
		</div>

	</div>

	<hr/>

	<p><a class="btn" data-action='card'>Manage Payment Options</a></p>
	<p><a class="btn" data-action='password'>Change Password</a></p>

	<!-- Recently Used Companies List -->
	{{#if Object.size(User.user.companies)}}
		<hr/><h3>Recently Used Companies</h3>
	{{#endif}}

	<div class="left">
		{{#foreach User.user.companies}}
			{{#if Template.data.val.phone}}
				<a class="block-section" href="tel:{{$val.phone.replace(/\ /g,'');}}" style="text-decoration: none;">
					<span class="fright btn small" style="margin-left: 10px; margin-top: -5px;">{{$val.phone}}</span>
					{{$val.name}}
				</a>
			{{#endif}}
			{{#if !Template.data.val.phone}}
				<div class="block-section" style="text-decoration: none;">{{$val.name}}</div>
			{{#endif}}
		{{#endforeach}}
	</div>
	

</div>