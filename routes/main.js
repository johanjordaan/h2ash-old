var movement = require('../utils/movement.js');

module.exports = function(app) {
	this.app = app;
  
	this.main = function(req, res){
		res.render('main/main', { title: 'Main Page' });
	};  

  
	var ship = {
		id : 1,
		px : 100,
		py : 100,
		tx : 100,
		ty : 100,
		v  : 0,
		heading : 0,
		av : 1,
		last_update : movement.getTimestamp()
	};
	this.set_position = function(id,parms) {
		ship.px = parms.x;
		ship.py = parms.y;
		ship.last_update = new Date();
		//console.log(ship)
	}
	this.set_target = function(id,parms) {
		ship.tx = parms.x;
		ship.ty = parms.y;
		ship.v = parms.v;
	}
	
  
	var data = [ship];

	var last = movement.getTimestamp();
	this.list_objects = function(req, res){
		var ts = movement.getTimestamp();
		movement.update_movable_object(ship,ts);
		last = ts;
		res.json(data);
	};  

	this.call_function_on_object = function(req,res) {
		movement.update_movable_object(ship,movement.getTimestamp());
		//console.log(req.params.source+"--"+req.params.action);
		console.log(req.body.p)
		this[req.params.action](req.params.source,req.body.p);
		//p.actions[req.params.action].start()
		//console.log(ship);
		res.json(ship);
	}
  
    
  this.app.get('/main', this.main);
  //this.app.post('/main/object2d', this.create_thing);	// Update
  //this.app.put('/main/object2d', this.create_thing);	// Create
  this.app.get('/main/objects', this.list_objects);		// List
  
  this.app.post('/main/object/:source/:action', this.call_function_on_object);	// Update
 
}




