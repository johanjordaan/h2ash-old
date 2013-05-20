if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var deg2rad = function(deg) { return (deg*(Math.PI/180.)); }
var rad2deg = function(rad) { return rad*(180./Math.PI); }


// theta in radians relative to x axis - counter clockwise
// r is always > 0

var c2p = function(x,y) {
	return {r:Math.sqrt(x*x + y*y),theta:Math.atan2(y,x)}
} 

var p2c = function(r,theta) {
	return {x:r*Math.cos(theta),y:r*Math.sin(theta)}; 	// [x,y]
}

var min_angle_between = function(theta1,theta2) {
	var delta = theta2 - theta1;
	if(delta>Math.PI) delta = delta -2*Math.PI;
	if(delta<-Math.PI) delta = 2*Math.PI +delta;
	return delta;
} 

if(typeof module != 'undefined') {
    module.exports.deg2rad = deg2rad;
	module.exports.rad2deg = rad2deg;
	module.exports.c2p = c2p;
	module.exports.p2c = p2c;
	module.exports.min_angle_between = min_angle_between;
} else {
}