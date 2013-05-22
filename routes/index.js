var _ = require('underscore');

var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;

var mapper = new Mapper();

module.exports = function(app) {
  index = function(req, res){
    res.render('index', { title: 'h2ash' });
  };  
  
  login = function(req,res) {
	mapper.load(player_map,req.body.email,function(player){
		if(_.isUndefined(player)) {
			res.json({success:false,message:'Invalid login...'});	
		} else {
			if(player.password==req.body.password) {
				req.session.logged_in = true;
				req.session.email = player.email;
				req.session.user_name = player.user_name;
				res.json({success:true,url:'/main'});
			} else {
				res.json({success:false,message:'Invalid login...'});
			}
		}
		
	});
  }

  logout = function(req,res) {
	req.session.logged_in = false;
	res.redirect('/');	
  }
  
  app.get('/', index);
  app.post('/login', login);
  app.get('/logout', logout);
}




