var AppView = require('./views/appview');
var Helper = require('./modules/helper');

module.exports = function(params) {

	new AppView({
		"friendlyMines": params.friendlyMines  
	});

}