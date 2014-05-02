<div class="block">
	<h2>Settings</h2>

	<h3 class="underlined">General Settings</h3>

	<table class='borderless'>
		<tr>
			<td>Tool Tips:</td>
			<td style="text-align: right;"><input type="checkbox" {{#if Config.get("tooltips") != "off"}}checked{{#off}} /></td>
		</tr>
	</table>
	
	<h3 class="underlined">Push Notification Settings</h3>

	<table class='borderless'>
		<tr>
			<td>New Bookings:</td>
			<td style="text-align: right;"><input type="checkbox" /></td>
		</tr>
		<tr>
			<td>Bookings Bin:</td>
			<td style="text-align: right;"><input type="checkbox" /></td>
		</tr>
		<tr>
			<td>Bookings Bin Radius:</td>
			<td style="text-align: right;">
				<select id="bookings-bin-radius">
					<option value="5">5 miles</option>
					<option value="10">10 miles</option>
					<option value="15">15 miles</option>
					<option value="20">20 miles</option>
					<option value="25">25 miles</option>
					<option value="30">30 miles</option>
					<option value="35">35 miles</option>
					<option value="40">40 miles</option>
					<option value="45">45 miles</option>
					<option value="50">50 miles</option>
				</select>
			</td>
		</tr>
	</table>

	<center><a class="btn">Save Settings</a></center>
	<br/>

	<h3 class="underlined">Account Details</h3>

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