module.exports = '<div class="inline-list">WARNING! The following mines were unreachable: \
				<ul> \
				<% _.each(failedMines, function(mine) { %> \
					<li> \
					<%= mine %> \
					</li> \
				<% }) %> \
				</ul> \
				</div>';