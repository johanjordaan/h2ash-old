if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	mapper = require('../utils/mapper.js');
}

var Ship = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
}
Ship.prototype.set = function(source) {
	mapper.update(this.map,this,source);
};

Ship.prototype.update = function(timestamp) {
	_.each(this.cpus,function(cpu){
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
}

if(typeof module != 'undefined') {
	module.exports.Ship = Ship;
} else {
}