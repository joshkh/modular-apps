module.exports = '<span>WARNING! The following mines were unreachables: </span> \
				<ul class="inline"> \
				<% _.each(failedMines, function(mine) { %> \
					<li> \
					<%= mine %> \
					</li> \
				<% }) %> \
				</ul>';