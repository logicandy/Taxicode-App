<form class="block pay" data-submit="Booking.pay.card">

	<h2>Card Details</h2>

	{{%Template.render("common/card", {cards: Booking.form_data.card_types}).html();}}

	{{#if User.user}}
		<label class="checkbox-field">
			<input type="checkbox" name="save" />
			<div>Save Card Details</div>
		</label>
	{{#endif}}

	{{#if !User.user}}
		<input type="hidden" name="save" data-value="false" />
	{{#endif}}

	<div class="group" style="margin-bottom: -10px;">
		<a class="block-section center first" onclick="Views.render('booking', 'slideFromLeft', 'customer');">Go Back</a><!--
		--><input type="submit" class="block-section center" value="Next" />
	</div>

</div>