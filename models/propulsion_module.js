if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	mapper = require('../utils/mapper.js');
	ShipModule = require('../models/ship_module.js').ShipModule;
}

var PropulsionModule = function(map,source) {
	_.extend(this,new ShipModule(map,source));
	
	this.commands = {
		0x01 : { name:'set_speed', latency:1.1, action:function(r){ this.set_speed(r[2]);} },
		0x02 : { name:'get_speed', latency:0.5, action:function(r){ r[2] = this.get_speed();} },

	}	
}
PropulsionModule.prototype.set_speed = function(perc) {
	if(perc<0) perc = 0;
	else if(perc>100) perc = 100;
	
	this.speed = this.type.max_speed*perc/100;
}
PropulsionModule.prototype.get_speed = function() {
	return (this.speed/this.type.max_speed)*100;
}


if(typeof module != 'undefined') {
	module.exports.PropulsionModule = PropulsionModule;
} else {
}