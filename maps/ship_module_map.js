if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	ShipModule = require('../models/ship_module.js').ShipModule;
}
var ship_module_map = {
	model_name	: 'ShipModule',
	fields		: {
		base_latency 	: { type:'Simple', default_value:0 },
		activated		: { type:'Simple', default_value:false,conversion:function(val){ return val=='true'} },
		completion_time	: { type:'Simple', default_value:0/*, conversion:time.get_timestamp*/ },
		module_id	 	: { type:'Simple', default_value:0 },
	},
	default_collection	: 'ShipModules',
	cls : ShipModule
}

if(typeof module != 'undefined') {
    module.exports.ship_module_map = ship_module_map;
} else {
}