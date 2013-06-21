if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	propulsion_module_type_map = require('../maps/propulsion_module_type_map.js').propulsion_module_type_map;	
	PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;
}
var propulsion_module_map = {
	model_name	: 'PropulsionModule',
	fields		: {
		type			: { type:'Ref' ,map:propulsion_module_type_map },
		speed			: { type:'Simple', default_value:0,conversion:Number },
		activated		: { type:'Simple', default_value:false,conversion:function(val){ return val=='true'} },
	},
	default_collection	: 'PropulsionModules',
	cls : PropulsionModule
}

if(typeof module != 'undefined') {
    module.exports.propulsion_module_map = propulsion_module_map;
} else {
}