<div class="block">

	<h2>Help</h2>

	{{#foreach Help.FAQ}}
		<div class="expand-block">
			<h3>{{%data.val.question}}</h3>
			<div>{{%data.val.answer}}</div>
		</div>
	{{#endforeach}}

	<br/>

	<p><a href="{{%Config.domains.main}}" target="_blank">Taxicode</a></p>
	<p><a href="{{%Config.domains.compare}}" target="_blank">Taxi Price Compare</a></p>
	<p><small>Developed by Web3r.</small></p>

	{{#if Config.mode=="developement"}}
		<hr />
		<h3>Dev Mode Toolkit</h3>
		<a href="test.html">Test Page</a>
	{{#endif}}

</div>