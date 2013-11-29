var AppView = require('./views/appview');
var Helper = require('./modules/helper');

module.exports = function(params) {

	var view = new AppView(params);
	if ($(params.target).length != 1) throw "Not found";
	view.setElement($(params.target));
	view.render();

	//console.log(view.re);

	//$(params.target).html(view.render().el);
	

}