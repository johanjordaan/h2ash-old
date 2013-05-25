var object_map = {
	model_name	: 'Object',
	fields		: {
		p_x			: { type:'Simple', default_value:0, conversion:Number },
		p_y			: { type:'Simple', default_value:0, conversion:Number },
		t_x			: { type:'Simple', default_value:0, conversion:Number },
		t_y			: { type:'Simple', default_value:0, conversion:Number },
		v			: { type:'Simple', default_value:0, conversion:Number },
		heading		: { type:'Simple', default_value:0, conversion:Number },
		av			: { type:'Simple', default_value:0, conversion:Number },
		t_r			: { type:'Simple', default_value:0, conversion:Number },
		t_theta		: { type:'Simple', default_value:0, conversion:Number },
		last_update	: { type:'Simple', default_value:0, conversion:Number },
	},
	default_collection	: 'Objects'
}

if(typeof module != 'undefined') {
    module.exports.object_map = object_map;
} else {
    alert('player_map.js is not for FE');
}