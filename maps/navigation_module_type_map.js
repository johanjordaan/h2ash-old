if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	NavigationModuleType = require('../models/navigation_module_type.js').NavigationModuleType;
}
var navigation_module_type_map = {
	model_name	: 'NavigationModuleType',
	fields		: {
		name			: { type:'Simple', default_value:''},
		description		: { type:'Simple', default_value:''},
		latency			: { type:'Simple', default_value:0,conversion:Number },
	},
	default_collection	: 'NavigationModulesTypes',
	cls : NavigationModuleType
}

if(typeof module != 'undefined') {
    module.exports.navigation_module_type_map = navigation_module_type_map;
} else {
}