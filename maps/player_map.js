var Player = require('../models/player.js').Player;

var player_map = {
	model_name	: 'Player',
	fields		: {
		email		: { type:'Simple', default_value:'' },
		password	: { type:'Simple', default_value:'' },
	},
	default_collection	: 'Players'
}

if(typeof module != 'undefined') {
    module.exports.point_map = point_map;
} else {
    alert('point_map.js is not for FE');
}