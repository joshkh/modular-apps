module.exports = 'WARNING! The following mines were unreachable: \
				<ul> \
				<% _.each(failedMines, function(mine) { %> \
					<li> \
					<%= mine %> \
					</li> \
				<% }) %> \
				</ul>';