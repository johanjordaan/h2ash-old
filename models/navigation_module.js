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
		0x01 : { name:'set_target', latency:1, action:function(r){ this.set_terget(r[2],r[3]);} },
	}	
}
NavigationModule.prototype.set_target = function(x,y) {
	this.target_x = x;
	this.target_y = y;
}

if(typeof module != 'undefined') {
	module.exports.NavigationModule = NavigationModule;
} else {
}