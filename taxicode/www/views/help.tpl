<div class="block">

	<h2>Help</h2>

	{{#foreach Help.FAQ}}
		<div class="expand-block faq">
			<h3>{{%data.val.question}}</h3>
			<div>{{%data.val.answer}}</div>
		</div>
	{{#endforeach}}

	<br/>

	<p><small>Developed by Web3r.</small></p>

</div>