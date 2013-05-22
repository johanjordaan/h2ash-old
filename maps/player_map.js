var player_map = {
	model_name	: 'Player',
	id_field    : 'email',
	fields		: {
		email		: { type:'Simple', default_value:'' },
		user_name	: { type:'Simple', default_value:'' },
		password	: { type:'Simple', default_value:'' }
	},
	default_collection	: 'Players'
}

if(typeof module != 'undefined') {
    module.exports.player_map = player_map;
} else {
    alert('player_map.js is not for FE');
}