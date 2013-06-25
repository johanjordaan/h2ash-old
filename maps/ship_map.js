if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	cpu_map = require('../maps/cpu_map.js').cpu_map;
	ship_type_map = require('../maps/ship_type_map.js').ship_type_map;
	mechanical_object_map = require('../maps/mechanical_object_map.js').mechanical_object_map;
	propulsion_module_map = require('../maps/propulsion_module_map.js').propulsion_module_map;
	navigation_module_map = require('../maps/navigation_module_map.js').navigation_module_map;
	Ship = require('../models/ship.js').Ship;
}
var ship_map = {
	model_name	: 'Ship',
	fields		: {
		type				: { type:'Ref' , map:ship_type_map },
		mechanical_object 	: { type:'Ref' , map:mechanical_object_map, internal:true },
		cpus				: { type:'List', map:cpu_map},
		propulsion_modules	: { type:'List', map:propulsion_module_map},
		navigation_modules	: { type:'List', map:navigation_module_map},
	},
	default_collection	: 'Ships',
	cls : Ship
}

if(typeof module != 'undefined') {
    module.exports.ship_map = ship_map;
} else {
}