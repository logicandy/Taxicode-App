<div class="block">

	<h2>Help</h2>

	{{#if Config.get("tooltips") == "off"}}
		<p class="center" onclick="Config.set('tooltips', 'on');$(this).fadeOut();">
			<span>Turn Tool Tips back on?</span>
			<input type="checkbox" style="display: inline; width: auto;">
		</p>
	{{#endif}}

	{{#foreach Help.FAQ}}
		<div class="expand-block faq">
			<h3>{{%data.val.question}}</h3>
			<div>{{%data.val.answer}}</div>
		</div>
	{{#endforeach}}

	<br/>

	<p date-dev-mode-count="20"><small>Developed by Web3r.</small></p>

</div>