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
		t_r			:0,
		t_theta 	:Math.PI/2,
		last_update	:timestamp
	};
}

var set_target = function(object,t_x,t_y,timestamp) {
	update(object,timestamp);
	var pc = trig.c2p(t_x-object.p_x,t_y-object.p_y);
	object.t_r = pc.r;
	object.t_theta = pc.theta;
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

var very_small = 0.000001;

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
	//console.log('object.t_theta : '+object.t_theta);
	//console.log('object.heading : '+object.heading);
	//console.log('angle_diff : '+angle_diff);

	// Calculate the angular displacement in the time given
	//
	var delta_angle = delta_t * object.av;
	//console.log('delta_angle : '+delta_angle);
	
	// Update the heading with the angular displacement or set the heading to
	// be the same as the target direction : Need to get rid of these abs's
	// inefficient ....?
	//
	if(Math.abs(delta_angle)>Math.abs(angle_diff) || Math.abs(angle_diff)<very_small) {
		object.heading = object.t_theta;
	} else {
		if(angle_diff>0)
			object.heading = object.heading + delta_angle;
		else
			object.heading = object.heading - delta_angle;
	}	
	
	// Calculate the linear displacement in the given time and clamp it to the
	// distance to the target.
	//
	var delta_r = delta_t * object.v;
	if(delta_r>object.t_r)
		delta_r = object.t_r;
	
	// Conevrt the heading/delta_r to cartesioian coordinates. These coordinates are
	// the offset values.
	//
	var c_coords = trig.p2c(delta_r,object.heading);
	object.px += c_coords.x;
	object.py += c_coords.y;
	object.last_update = timestamp;
	
	/*
	
	var da = t*Number(object.av);
	
	if(object.tx==object.px && object.ty==object.py) return;


	var ttx = Number(object.tx)-Number(object.px);
	var tty = Number(object.ty)-Number(object.py);


	// Calculate angle from target to heading
	//
	var angle_to_target = calculate_angle_to_target(ttx,tty);
	var angle_target_to_heading = object.heading - angle_to_target;
	if(angle_target_to_heading<-180) angle_target_to_heading += 360;
	if(angle_target_to_heading>180) angle_target_to_heading -= 360;

	if(angle_target_to_heading>0) {
		angle_target_to_heading-=da;
		object.heading -= da;
		if(object.heading<0) object.heading += 360;
	} else {
		angle_target_to_heading+=da;
		object.heading += da;
		if(object.heading>=360) object.heading -= 360;
	}
	
	if(da>angle_to_target || angle_to_target<0.001) {
		object.heading = angle_to_target;
		object.dx = Number(object.tx);
		object.dy = Number(object.ty);
	} else {
		// Rotate the target by the required angles to get a new destination
		//
		var theta = deg2rad(angle_target_to_heading);
		
		object.dx = ttx*Math.cos(theta) - tty*Math.sin(theta) +Number(object.px);
		object.dy = ttx*Math.sin(theta) + tty*Math.cos(theta) +Number(object.py);
	}

	
	// Don't update stationary things
    //
    if(Number(object.v) == 0) return;                                
    
    // Don't update objects that are at their destination
    //
    if(Number(object.px) == Number(object.dx) && Number(object.py) == Number(object.dy)) return;  
    
	// Calculate the distance traveled by the object in a straight line given v and t
	//
	var d = t*Number(object.v); 
    
    // Set the things position to be the same as the target and set the velocity to zero if:
    // 1) The distance covered in the elapsed time is larger than the distance to the target
    // 2) The distance to the target is very small.
    //
	var d_x = Number(object.dx)-Number(object.px);
	var d_y = Number(object.dy)-Number(object.py);
	var length = Math.sqrt(d_x*d_x + d_y*d_y);
    if(d>length || length < 0.001 ) {
		object.px = Number(object.dx);
		object.py = Number(object.dy);
		object.v = 0;
		object.last_update = timestamp;
        return;
    }
   
    // Once all the special cases has been handled then calculate the new position for the 
    // object
    //    
    var d_px = d_x/length;
    var d_py = d_y/length;
	
	// Apply the the deltas to the object
	//
	object.px += d*d_px;
	object.py += d*d_py;
	object.last_update = timestamp;*/
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