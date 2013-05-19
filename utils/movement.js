if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
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

var update_movable_object = function(object,timestamp) {
    // Don't update stationary things
    //
    if(Number(object.v) == 0) return;                                
    
    // Don't update things that are at their destination
    //
    if(Number(object.px) == Number(object.dx) && Number(object.py) == Number(object.dy)) return;  
    
    // Calculate the amount of seconds elapsed since the the last update
    //
	var lut = object.last_update //new Date(Date.parse(object.last_update));
    var t =  (timestamp - lut)/1000; //(date.getTime() - lut.getTime())/1000;
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
	object.last_update = timestamp;
}

var deg2rad = function(deg) { return deg*(Math.PI/180.); }
var rad2deg = function(rad) { return rad*(180./Math.PI); }

var calculate_angle_to_target = function(target_x,target_y){
	var angle = rad2deg(Math.atan(target_y/target_x));
	if(target_x>=0) return 90-angle;
	if(target_x<0) return 270-angle;
} 


if(typeof module != 'undefined') {
    module.exports.update_movable_object = update_movable_object;
	module.exports.getTimestamp = getTimestamp;
	module.exports.calculate_angle_to_target = calculate_angle_to_target;
	
} else {
}