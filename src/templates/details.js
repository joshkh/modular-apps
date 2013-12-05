//module.exports = '<h2>test</h2>';

module.exports = '<div class="innerDetailsContainer"> \
	<div>◀ Close</div> \
	<h2>Pathway Name</h2> \
	<% console.log(JSON.stringify(pway, null, 2)); %> \
	<%= "<a href=http://" + pway.organism[0].genes[0].url + "/report.do?id=" + pway.organism[0].genes[0].pathwayId + ">" %> \
	<%= pway.name %> \
	</a> \
	<h2>Organism</h2> \
	<%= "<a href=http://" + pway.organism[0].genes[0].url + "/report.do?id=" + pway.organism[0].objectId + ">" %> \
	<%= pway.organism[0].shortName %> \
	</a> \
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
				<%= "<a href=http://" + pway.organism[0].genes[0].url + "/report.do?id=" + dataset.objectId + ">" %> \
				<%= dataset.name %> \
				</a> \
			</li> \
		<% }); %> \
	</ul></div>';