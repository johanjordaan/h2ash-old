if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	ship_module_map = require('../maps/ship_module_map.js').ship_module_map;	
	navigation_module_type_map = require('../maps/navigation_module_type_map.js').navigation_module_type_map;	
	NavigationModule = require('../models/navigation_module.js').NavigationModule;
}
var navigation_module_map = {
	model_name	: 'NavigationModule',
	fields		: _.extend({
		type			: { type:'Ref' ,map:navigation_module_type_map },
		target_x		: { type:'Simple', default_value:0,conversion:Number },
		target_y		: { type:'Simple', default_value:0,conversion:Number },
	},ship_module_map.fields),
	default_collection	: 'NavigationModules',
	cls : NavigationModule
}

if(typeof module != 'undefined') {
    module.exports.navigation_module_map = navigation_module_map;
} else {
}