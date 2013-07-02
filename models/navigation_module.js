if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	mapper = require('../utils/mapper.js');
	ShipModule = require('../models/ship_module.js').ShipModule;
}

var NavigationModule = function(map,source) {
	_.extend(this,new ShipModule(map,source));
	
	this.commands = {
		0x01 : { name:'set_target'				, latency:1, action:function(r,timestamp){ this.set_target(r[2],r[3],timestamp);} },
		0x02 : { name:'get_distance_to_target'	, latency:1, action:function(r,timestamp){ r[2] = this.get_distance_to_target(); } },
		
	}	
}
NavigationModule.prototype.set_target = function(x,y,timestamp) {
	this.ship.set_target(x,y,timestamp);
}
NavigationModule.prototype.get_distance_to_target = function() {
	var target = this.ship.get_target();
	var position = this.ship.get_position();
	return Math.sqrt((target.x-position.x)*(target.x-position.x) + (target.y-position.y)*(target.y-position.y));
}



if(typeof module != 'undefined') {
	module.exports.NavigationModule = NavigationModule;
} else {
}