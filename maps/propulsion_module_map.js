if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	ship_module_map = require('../maps/ship_module_map.js').ship_module_map;	
	propulsion_module_type_map = require('../maps/propulsion_module_type_map.js').propulsion_module_type_map;	
	PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;
}
var propulsion_module_map = {
	model_name	: 'PropulsionModule',
	fields		: _.extend({
		type			: { type:'Ref' ,map:propulsion_module_type_map },
		speed			: { type:'Simple', default_value:0,conversion:Number },
	},ship_module_map.fields),
	default_collection	: 'PropulsionModules',
	cls : PropulsionModule
}

if(typeof module != 'undefined') {
    module.exports.propulsion_module_map = propulsion_module_map;
} else {
}