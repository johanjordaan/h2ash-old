var _ = require('underscore');

module.exports = function(app) {
	galaxy_test = function(req, res){
		res.render('galaxy_test');
	};  
  
	app.get('/galaxy_test',galaxy_test);
}




