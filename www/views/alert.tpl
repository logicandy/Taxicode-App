<div class="alert">
	<div class="inner">
		{{#if Template.data.title}}
			<div class="header"><h2>{{$title}}</h2></div>
		{{#endif}}
		<div class="body">
			{{$data}}
			{{#if Template.data.prompt}}
				<input class="prompt" type="input" />
			{{#endif}}
		</div>
		{{#if Template.data.options}}
			<div class="footer">
				<div class="options">
					{{#foreach Template.data.options}}
						<a class="option {{%Template.data.key==0?'first':''}} {{%Template.data.key==Template.data.options.length-1?'last':''}}" style="width: {{%100/Template.data.options.length}}%" data-id="{{$val}}" tabindex="-1">
							{{$val}}
						</a>
					{{#endforeach}}
				</div>
			</div>
		{{#endif}}
	</div>
</div>