//module.exports = '<h2>test</h2>';

module.exports = '<div class="detailsInnerContainer"><h2><%= pway.name %></h2> \
	<h2><%= pway.organism[0].shortName %></h2> \
	<h2>Intersection of Homologous Genes</h2> \
	<ul class="genes"> \
		<% _.each(pway.organism[0].genes, function(gene) { %> \
			<% console.log(gene) %> \
			<li> \
			<%= "<a href=http://" + gene.url + "/report.do?id=" + gene.objectId + ">" %> \
				<%= gene.primaryIdentifier %> \
			</a> \
			</li> \
		<% }) %> \
	</ul> \
	<h2>Data Set(s)</h2> \
	<ul> \
		<% _.each(pway.datasets, function(dataset) { %> \
			<li> \
				<%= dataset.name %> \
			</li> \
		<% }); %> \
	</ul></div>';