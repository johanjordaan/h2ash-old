if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	trig = require('../utils/trig');
	time = require('../utils/time.js');
	mapper = require('../utils/mapper.js');
}

var MechanicalObject = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
}
MechanicalObject.prototype.set = function(source) {
	mapper.update(this.map,this,source);
};

MechanicalObject.prototype._update_target_variables = function(){
	if(this.x == this.t_x && this.y == this.t_y) return;
	var pc = trig.c2p(this.t_x-this.x,this.t_y-this.y);
	this.t_r = pc.r;
	this.t_theta = pc.theta;
}

var very_small = 0.00000001;
MechanicalObject.prototype.update = function(timestamp) {
    // Calculate the amount of seconds elapsed since the the last update
    //
    var delta_t = (timestamp - this.last_update)/1000;
	
	// Calculate the difference in angle between the heading and the target 
	// direction
	//
	var angle_diff = trig.min_angle_between(this.heading,this.t_theta);

	// Calculate the angular displacement in the time given
	//
	var delta_angle = delta_t * this.av;
	//console.log('delta_angle : '+delta_angle);
	
	// Update the heading with the angular displacement or set the heading to
	// be the same as the target direction : Need to get rid of these abs's
	// inefficient ....?
	//
	if(Math.abs(delta_angle)>Math.abs(angle_diff) || Math.abs(angle_diff)<very_small) {
		this.heading = this.t_theta;
	} else {
		if(angle_diff>0)
			this.heading = this.heading + delta_angle;
		else
			this.heading = this.heading - delta_angle;
	}	
	if(this.heading<0)
		this.heading += 2*Math.PI;
	if(this.heading>2*Math.PI)
		this.heading -= 2*Math.PI;
	
	
	// Calculate the linear displacement in the given time and clamp it to the
	// distance to the target.
	//
	var delta_r = delta_t * this.v;
	if(delta_r>this.t_r)
		delta_r = this.t_r;
	
	// Convert the heading/delta_r to cartesian coordinates. These coordinates are
	// the offset values.
	//
	var c_coords = trig.p2c(delta_r,this.heading);
	this.x += c_coords.x;
	this.y += c_coords.y;
	
	
	// Reset the target r and theta
	//
	this._update_target_variables();
	
	this.last_update = timestamp;
}

if(typeof module != 'undefined') {
	module.exports.MechanicalObject = MechanicalObject;
} else {
}