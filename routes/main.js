var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;
var object_map = require('../maps/object_map.js').object_map;

var object = require('../utils/object.js');

var mapper = new Mapper();

module.exports = function(app) {
	main = function(req, res){
		res.render('main', { user_name:req.session.user_name,email:req.session.email });
	};  
  
	//var ship = object.create(100,100,object.getTimestamp());
	this.set_target = function(id,parms) {
		object.set_target(ship,parms.x,parms.y,object.getTimestamp());
	}
	this.set_velocity = function(id,parms) {
		object.set_velocity(ship,parms.v,object.getTimestamp());
	}
	this.set_angular_velocity = function(id,parms) {
		object.set_velocity(ship,parms.av,object.getTimestamp());
	}
  
//	var data = [ship];

	var last = object.getTimestamp();
	list_objects = function(req, res){
		var ret_val = {my_ship:{},others:{}}
		
		mapper.load(player_map,req.session.email,function(player){
			res.json([player.ship]);
		});
		
		//var ts = object.getTimestamp();
		//object.update(ship,ts);
		//console.log(ship);
		//last = ts;
		//res.json(data);
	};  

	call_function_on_object = function(req,res) {
		// Need to convert source to req.params.source to owner's ship
		this[req.params.action](ship,req.body.p);
		res.json(ship);
	}
  
	auth = function(req,res,next) {
		if(req.session.logged_in == true) return next();
		res.redirect('/');	
	}
    
	app.get('/main',auth,main);
	app.get('/main/objects',auth,list_objects);
	app.post('/main/object/:source/:action',auth,call_function_on_object);
 
}




