{{#foreach Template.data.errors}}
	<div>
		{{#if typeof Template.data.val.field == "string"}}
			<strong>{{$val.field}}:</strong>
		{{#endif}}
		{{#if typeof Template.data.val.field != "string"}}
			<strong>{{%ucwords($(Template.data.val.field).attr('name').split("_").join(" "))}}:</strong>
		{{#endif}}
		<span>{{%Template.data.val.message}}</span>
	</div>
{{#endforeach}}