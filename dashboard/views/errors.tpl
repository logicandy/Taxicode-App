{{#foreach Template.data.errors}}
	<div>
		<strong>{{%ucwords($(Template.data.val.field).attr('name').split("_").join(" "))}}:</strong>
		<span>{{%Template.data.val.message}}</span>
	</div>
{{#endforeach}}