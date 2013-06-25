if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	ShipType = require('../models/ship_type.js').ShipType;
}
var ship_type_map = {
	model_name	: 'ShipType',
	fields		: {
		name			: { type:'Simple', default_value:''},
		description		: { type:'Simple', default_value:''},
	},
	default_collection	: 'ShipTypes',
	cls : ShipType
}

if(typeof module != 'undefined') {
    module.exports.ship_type_map = ship_type_map;
} else {
}