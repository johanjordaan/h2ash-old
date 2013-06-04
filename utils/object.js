if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	trig = require('../utils/trig');
}

var getTimestamp = function() {
	if(typeof module != 'undefined') {
		var t = process.hrtime(); //[s,ns]
		var ret_val = ((t[0]*1e9 +t[1])/1e6);
		return ret_val;
	}
	else
		return window.performance.now();
}

// An object needs the following properties in oirder to be movable:
// px,py - position x and y : where the objects is currently the native measurement is m
// tx,ty - target x and y : where the objects wants to be
// v     - velocity measured in m/s
// heading - where the object is pointing relative to the y axis (clockwise)
// av	 - angular velocity in ??/s	
//

// px,py
// tx,ty
// 

var create = function(x,y,timestamp) {
	return {
		p_x			:x,
		p_y			:y,
		v			:0,
		heading		:Math.PI/2,
		av			:0,
		t_x			:x,
		t_y			:y,
		t_r			:0,
		t_theta 	:Math.PI/2,
		last_update	:timestamp
	};
}

var _update_target_variables = function(object){
	if(object.p_x == object.t_x && object.p_y == object.t_y) return;
	var pc = trig.c2p(object.t_x-object.p_x,object.t_y-object.p_y);
	object.t_r = pc.r;
	object.t_theta = pc.theta;
}

var set_target = function(object,t_x,t_y,timestamp) {
	update(object,timestamp);
	
	object.t_x = t_x;
	object.t_y = t_y;
	_update_target_variables(object);
}

var set_velocity = function(object,v,timestamp) {
	update(object,timestamp);
	object.v = v;
}

// Av is in degrees
var set_angular_velocity = function(object,av,timestamp) {
	update(object,timestamp);
	object.av = trig.deg2rad(av);
}

var very_small = 0.00000001;

var update = function(object,timestamp) {
    // Calculate the amount of seconds elapsed since the the last update
    //
    var delta_t = (timestamp - object.last_update)/1000;
	//console.log('------');
	//console.log('delta_t : '+delta_t);
	
	// Calculate the difference in angle between the heading and the target 
	// direction
	//
	var angle_diff = trig.min_angle_between(object.heading,object.t_theta);
	//console.log('object.t_theta : '+trig.rad2deg(object.t_theta));
	//console.log('object.heading : '+trig.rad2deg(object.heading));
	//console.log('angle_diff : '+angle_diff);

	// Calculate the angular displacement in the time given
	//
	var delta_angle = delta_t * object.av;
	//console.log('delta_angle : '+delta_angle);
	
	// Update the heading with the angular displacement or set the heading to
	// be the same as the target direction : Need to get rid of these abs's
	// inefficient ....?
	//
	//console.log(trig.rad2deg(angle_diff));
	if(Math.abs(delta_angle)>Math.abs(angle_diff) || Math.abs(angle_diff)<very_small) {
		object.heading = object.t_theta;
	} else {
		if(angle_diff>0)
			object.heading = object.heading + delta_angle;
		else
			object.heading = object.heading - delta_angle;
	}	
	if(object.heading<0)
		object.heading += 2*Math.PI;
	if(object.heading>2*Math.PI)
		object.heading -= 2*Math.PI;
	
	
	// Calculate the linear displacement in the given time and clamp it to the
	// distance to the target.
	//
	var delta_r = delta_t * object.v;
	if(delta_r>object.t_r)
		delta_r = object.t_r;
	
	// Convert the heading/delta_r to cartesian coordinates. These coordinates are
	// the offset values.
	//
	var c_coords = trig.p2c(delta_r,object.heading);
	object.p_x += c_coords.x;
	object.p_y += c_coords.y;
	
	
	// Reset the target r and theta
	//
	_update_target_variables(object);
	
	object.last_update = timestamp;
}

if(typeof module != 'undefined') {
	module.exports.create = create;
	module.exports.set_target = set_target;
	module.exports.set_velocity = set_velocity;
	module.exports.set_angular_velocity = set_angular_velocity;
	module.exports.update = update;
	
	module.exports.getTimestamp = getTimestamp;

} else {
}