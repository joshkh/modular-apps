module.exports = '<thead>\
		<tr>\
		<th></th>\
	<% _.each(columns, function(col) { %>\
		<th><%= col.sName %></th>\
	<% }) %>\
	</tr>\
	</thead>';