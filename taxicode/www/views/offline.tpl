<div id="offline">

	<br/>
	<img src="img/{{%Config.subdir}}/logo_colour.png" />
	<br/>
	<br/>

	<h1>No Connection!</h1>

	<p>There was a problem connecting to our Taxicode servers.</p>
	<p>Please check you are connected to the internet and try again.</p>
	<br/>
	<p><a class="btn" onclick="App.loading();App.pingServer(App.stopLoading);">Try Again</a></p>

	{{#if Config.mode=="developement"}}
		<div class="console"><input type="text" autocapitalize="off" autocorrect="off"></div>
	{{#endif}}

</div>