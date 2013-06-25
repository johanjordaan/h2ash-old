if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	ship_map = require('../maps/ship_map.js').ship_map;
}
var player_map = {
	model_name	: 'Player',
	id_field    : 'email',
	fields		: {
		email		: { type:'Simple', default_value:'' },
		user_name	: { type:'Simple', default_value:'' },
		password	: { type:'Simple', default_value:'' },
		ship		: { type:'Ref'	 , map:ship_map, internal:false }
	},
	default_collection	: 'Players'
}

if(typeof module != 'undefined') {
    module.exports.player_map = player_map;
} else {
}