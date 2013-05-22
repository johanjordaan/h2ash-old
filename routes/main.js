var object = require('../utils/object.js');

module.exports = function(app) {
	this.app = app;
  
	this.main = function(req, res){
		res.render('main', { user_name:req.session.user_name,email:req.session.email });
	};  
  
	var ship = object.create(100,100,object.getTimestamp());
	this.set_target = function(id,parms) {
		object.set_target(ship,parms.x,parms.y,object.getTimestamp());
	}
	this.set_velocity = function(id,parms) {
		object.set_velocity(ship,parms.v,object.getTimestamp());
	}
	this.set_angular_velocity = function(id,parms) {
		object.set_velocity(ship,parms.av,object.getTimestamp());
	}
  
	var data = [ship];

	var last = object.getTimestamp();
	this.list_objects = function(req, res){
		var ts = object.getTimestamp();
		object.update(ship,ts);
		//console.log(ship);
		last = ts;
		res.json(data);
	};  

	this.call_function_on_object = function(req,res) {
		// Need to convert source to req.params.source to owner's ship
		this[req.params.action](ship,req.body.p);
		res.json(ship);
	}
  
	auth = function(req,res,next) {
		if(req.session.logged_in == true) return next();
		res.redirect('/');	
	}
    
	this.app.get('/main',auth, this.main);
	this.app.get('/main/objects',auth, this.list_objects);
	this.app.post('/main/object/:source/:action',auth,this.call_function_on_object);
 
}




