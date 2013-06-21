if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	PropulsionModuleType = require('../models/propulsion_module_type.js').PropulsionModuleType;
}
var propulsion_module_type_map = {
	model_name	: 'PropulsionModuleType',
	fields		: {
		name			: { type:'Simple', default_value:''},
		description		: { type:'Simple', default_value:''},
		latency			: { type:'Simple', default_value:0,conversion:Number },
		max_speed		: { type:'Simple', default_value:0,conversion:Number },
	},
	default_collection	: 'PropulsionModulesTypes',
	cls : PropulsionModuleType
}

if(typeof module != 'undefined') {
    module.exports.propulsion_module_type_map = propulsion_module_type_map;
} else {
}