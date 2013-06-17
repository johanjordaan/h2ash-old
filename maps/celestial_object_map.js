if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	CelestialObject = require('../models/celestial_object.js').CelestialObject;
}

var celestial_object_map = {
	model_name	: 'CelestialObject',
	fields		: {
		name				: { type:'Simple', default_value:'' },
		radius				: { type:'Simple', default_value:0, conversion:Number },
		orbital_radius		: { type:'Simple', default_value:0, conversion:Number },
		orbital_speed		: { type:'Simple', default_value:0, conversion:Number },
		orbital_position	: { type:'Simple', default_value:0, conversion:Number },
		last_update			: { type:'Simple', default_value:0/*, conversion:time.get_timestamp*/ },
		x					: { type:'Simple', default_value:0, conversion:Number },
		y					: { type:'Simple', default_value:0, conversion:Number },
	},
	cls:CelestialObject,
	default_collection	: 'CelestialObjects'
}

if(typeof module != 'undefined') {
    module.exports.celestial_object_map = celestial_object_map;
} else {
}