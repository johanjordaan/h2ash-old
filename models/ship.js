if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	mapper = require('../utils/mapper.js');
	CPU = require('../models/cpu.js').CPU;
	NavigationModule = require('../models/navigation_module.js').NavigationModule;
	PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;
	
}

var Ship = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
}
Ship.prototype.set = function(source) {
	mapper.update(this.map,this,source);
};

Ship.prototype.add_module = function(module,module_id) {
	if(module instanceof CPU) {
		this.cpus.push(module);
	} else if(module instanceof NavigationModule) {
		this.navigation_modules.push(module);
	} else if(module instanceof PropulsionModule) {
		this.propulsion_modules.push(module);
	}	
	module.ship = this;
	module.module_id = module_id;
};
Ship.prototype.call_module = function(cpu,module_id,timestamp,callback) {
	var module = _.find(this.navigation_modules,function(module){ return module.module_id == module_id })
	if(_.isUndefined(module))
		module = _.find(this.propulsion_modules,function(module){ return module.module_id == module_id })

	if(!_.isUndefined(module))
		module.call_module(cpu,timestamp,callback);
	else
		callback(timestamp);
}


Ship.prototype.set_target = function(x,y,timestamp) {
	this.mechanical_object.t_x = x;
	this.mechanical_object.t_y = y;
}

Ship.prototype.get_target = function() {
	return {x:this.mechanical_object.t_x, y:this.mechanical_object.t_y };
}

Ship.prototype.get_position = function() {
	return {x:this.mechanical_object.x, y:this.mechanical_object.y };
}

Ship.prototype.update = function(timestamp) {
	_.each(this.cpus,function(module){
		cpu.step(timestamp);
	});	
	
	var new_speed = 0;
	_.each(this.propulsion_modules,function(propulsion_module){
		propulsion_module.update(timestamp);
		new_speed+=propulsion_module.speed;
	});
	this.v = new_speed;
	
	_.each(this.navigation_modules,function(navigation_module){
		navigation_module.update(timestamp);
		this.tx = navigation_module.target_x;
		this.yx = navigation_module.target_y;
	});
	
	this.mechanical_object.update(timestamp);
};

if(typeof module != 'undefined') {
	module.exports.Ship = Ship;
} else {
}