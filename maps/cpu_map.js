if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	CPU = require('../models/cpu.js').CPU;
}
var cpu_map = {
	model_name	: 'CPU',
	fields		: {
		paused		: { type:'Simple', default_value:false, conversion:function(val){ return val=='true'} },
		r			: { type:'SimpleList', default_value:[], conversion:Number },
		m			: { type:'SimpleList', default_value:[], conversion:Number },
	},
	default_collection	: 'CPUs',
	cls : CPU
}

if(typeof module != 'undefined') {
    module.exports.cpu_map = cpu_map;
} else {
}