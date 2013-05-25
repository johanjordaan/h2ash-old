var _ = require('underscore');
var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;
var object_map = require('../maps/object_map.js').object_map;

var object = require('../utils/object.js');

var mapper = new Mapper();

var update = function() {
	mapper.load_all(object_map,function(objects){
		_.each(objects,function(current_object){
			object.update(current_object,object.getTimestamp());
			
			mapper.save(object_map,current_object,function(obj){ });
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
  
	this.set_target = function(ship,parms) {
		object.set_target(ship,Number(parms.x),Number(parms.y),object.getTimestamp());
		mapper.save(object_map,ship,function(saved){  });
	}
	this.set_velocity = function(ship,parms) {
		object.set_velocity(ship,Number(parms.v),object.getTimestamp());
		mapper.save(object_map,ship,function(saved){ console.log('-----');console.log(saved);  });
	}
	this.set_angular_velocity = function(ship,parms) {
		object.set_angular_velocity(ship,Number(parms.av),object.getTimestamp());
		mapper.save(object_map,ship,function(saved){  });
	}
  
	list_objects = function(req, res){
		mapper.load(player_map,req.session.email,function(player){
			mapper.load_all(object_map,function(objects){
				res.json({my_ship_id:player.ship.id,ships:objects});
			});
		});
	};  

	call_function_on_object = function(req,res) {
		var that = this;
		// Need to convert source to req.params.source to owner's ship
		// Do it via session.req.ship ? or player.ship etc ...
		mapper.load(player_map,req.session.email,function(player){
			that[req.params.action](player.ship,req.body.p);
			res.json(player.ship);
		});
	}
  
	auth = function(req,res,next) {
		if(req.session.logged_in == true) return next();
		res.redirect('/');	
	}
    
	app.get('/main',auth,main);
	app.get('/main/objects',auth,list_objects);
	app.post('/main/object/:source/:action',auth,call_function_on_object);
 
}




