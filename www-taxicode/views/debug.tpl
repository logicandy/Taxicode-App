<div class="block">

	<h2>Debugger</h2>

	<p class="debugger">
		<textarea class="input" style="height: 100px;"></textarea>
		<center><a class="btn">Go</a></center>
		<span class="output"></span>
	</p>

	<script type="text/javascript">
		$(".debugger .btn").click(function() {
			$(".debugger .output").prepend("<p>" + eval($(".debugger .input").val()) + "</p><hr />");
		});
	</script>

</div>