var _ = require('underscore');
var printf = require('../utils/printf.js').printf;

var Mapper = require('../utils/mapper.js').Mapper;
var time = require('../utils/time.js');
var player_map = require('../maps/player_map.js').player_map;
var ship_map = require('../maps/ship_map.js').ship_map;
var Ship = require('../models/ship.js').Ship;


var mapper = new Mapper();

var update = function() {
	mapper.load_all(ship_map,function(ships){
		_.each(ships,function(db_ship){
			db_ship.update(time.get_timestamp());
			mapper.save(ship_map,db_ship,function(obj){ });
		});
		//process.nextTick(update);
		setTimeout(update,100);
	});
}
setTimeout(update,100);


module.exports = function(app) {
	main = function(req, res){
		res.render('main', { user_name:req.session.user_name,email:req.session.email });
	};  
  
	list_objects = function(req, res){
		mapper.load(player_map,req.session.email,function(player){
			mapper.load_all(ship_map,function(ships){
				res.json({my_ship_id:player.ship.id,ships:ships});
			});
		});
	};  

/*	call_function_on_object = function(req,res) {
		var that = this;
		// Need to convert source to req.params.source to owner's ship
		// Do it via session.req.ship ? or player.ship etc ...
		mapper.load(player_map,req.session.email,function(player){
			that[req.params.action](player.ship,req.body.p);
			res.json(player.ship);
		});
	}*/
  
	auth = function(req,res,next) {
		if(req.session.logged_in == true) return next();
		res.redirect('/');	
	}
    
	app.get('/main',auth,main);
	app.get('/main/objects',auth,list_objects);
//	app.post('/main/object/:source/:action',auth,call_function_on_object);
 
}




