<div class='block center'>

	<h2>Manage Payment Options</h2>

	{{#if User.user.card_token}}

		<br/>

		<div class="card-styled">
			<h3>Current Card</h3>
			<div class="chip"></div>
			<div class="number">**** **** **** {{%User.user.card_token.digits}}</div>
		</div>

		<p><a class="btn">Remove Card</a></p>

		<hr/>

		<h2>Replace Card</h2>

	{{#endif}}

	{{#if !User.user.card_token}}
		<h3>Add Payment Card</h3>
	{{#endif}}

	<form>

		{{%Template.render("common/card", {cards: Config.cards}).html();}}

	</form>



</div>