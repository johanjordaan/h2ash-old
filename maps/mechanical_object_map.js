if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	MechanicalObject = require('../models/celestial_object.js').MechanicalObject;
}

var mechanical_object_map = {
	model_name	: 'MechanicalObject',
	fields		: {
		x				: { type:'Simple', default_value:0, conversion:Number },
		y				: { type:'Simple', default_value:0, conversion:Number },
		v				: { type:'Simple', default_value:0, conversion:Number },
		heading			: { type:'Simple', default_value:0, conversion:Number },
		av				: { type:'Simple', default_value:0, conversion:Number },
		t_x				: { type:'Simple', default_value:0, conversion:Number },
		t_y				: { type:'Simple', default_value:0, conversion:Number },
		t_r				: { type:'Simple', default_value:0, conversion:Number },
		t_theta			: { type:'Simple', default_value:0, conversion:Number },
		last_update		: { type:'Simple', default_value:0/*, conversion:time.get_timestamp*/ },
	},
	cls:MechanicalObject,
	default_collection	: 'MechanicalObjects'
}


if(typeof module != 'undefined') {
    module.exports.mechanical_object_map = mechanical_object_map;
} else {
}