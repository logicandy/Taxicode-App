<div class="block">
	<h2>Settings</h2>

	<h3>Push Notification Settings</h3>

	<table class='borderless'>
		<tr>
			<td>New Bookings:</td>
			<td><input type="checkbox" /></td>
		</tr>
		<tr>
			<td>Bookings Bin:</td>
			<td><input type="checkbox" /></td>
		</tr>
		<tr>
			<td>Bookings Bin Radius:</td>
			<td>...</td>
		</tr>
	</table>

	<h3>Account Details</h3>

	<table class='borderless'>
		<tr>
			<td>Account Name:</td>
			<td>{{%User.user.name}}</td>
		</tr>
		<tr>
			<td>Company Name:</td>
			<td>{{%User.user.company.name}}</td>
		</tr>
		<tr>
			<td>Area{{%User.user.company.areas.length>1?"s":""}}:</td>
			<td>
				{{#foreach User.user.company.areas}}
					{{$val}}<br/>
				{{#endforeach}}
			</td>
		</tr>
	</table>

	<br/>
	<center><a class="btn">Logout</a></center>

</div>