<div class="block">
	<h2>Bookings Bin</h2>

	{{#if Config.get("tooltips") !== "off"}}
		<div class="block tool-tip" data-tooltip="0" style="margin-top: 5px;">
			<div class="close fright">&times;</div>
			<div class="inner">
				<span>{{%App.tooltips[0]}}</span>
			</div>
		</div>
	{{#endif}}

	<div class="block-sections">
		{{#foreach [1,2,3,4,5,6,7]}}
			<div class="block-section booking">

				<div class="calendar fleft" style="margin-left: 5px;">
					<span class="month">{{%(new Date().format('M \'y'))}}</span>
					<span class="date">{{%(new Date().format('j'))}}</span>
					<span class="time">{{%(new Date().format('g:ia'))}}</span>
				</div>

				<div style="margin-left: 75px;">
					<div class="price">&pound;12.0{{$val}}</div>
					<div class="distance">2 Miles</div>
					<div><strong>Pickup: </strong> Test</div>
					<div><strong>Via: </strong> Really really long place name</div>
					<div><strong>Destination: </strong> Test</div>
					<div><strong>Passengers: </strong> 7</div>
					<div><strong>Vehicles: </strong> 2 &times; Saloon</div>

					<!--<div class="actions">
						<a class="btn">Accept</a>
						<a class="btn">Reject</a>
					</div>-->
				</div>

				<div class="clear"></div>

			</div>
		{{#endforeach}}
	</div>

</div>