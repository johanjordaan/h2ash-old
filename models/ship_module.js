if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	time = require('../utils/time.js');
	mapper = require('../utils/mapper.js');
}

var ShipModule = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
}
ShipModule.prototype.set = function(source) {
	mapper.update(this.map,this,source);
};

// When a module is activated it gets passed the CPU and it can basically do with it what it wants but
// it is assumed that it would only use its memory and read the relevant registes

ShipModule.prototype.call = function(cpu,callback) {
	if(this.activated) return;		// Might need to return an error
	
	this.activated = true;		
	
	var latency = this.base_latency;
	this.current_command = this.commands[cpu[1]];
	this.current_cpu = cpu;
	this.current_callbacl = callback;
	if(_.isUndefined(this.current_command)) 
		latency += this.unknown_command_latency;
	else
		latency += command*=latency;
	
	this.completion_time = time.get_timestamp() + latency ;
		
};

ShipModule.prototype.update = function(timestamp) {
	if(!this.activated) return;
	if(timestamp>this.completion_time) {
		if(!_.isUndefined(this.current_command))
			this.current_command.action(this.currentr_cpu.r);
		
		this.current_callback();	
		this.activated = false;
	} 
}

if(typeof module != 'undefined') {
	module.exports.ShipModule = ShipModule;
} else {
}