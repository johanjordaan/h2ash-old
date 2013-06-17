if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	trig = require('../utils/trig');
	time = require('../utils/time.js');
	mapper = require('../utils/mapper.js');
}



var CelestialObject = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
}
CelestialObject.prototype.set = function(source) {
	mapper.update(this.map,this,source);
};

CelestialObject.prototype.update = function(timestamp) {
	var delta_t = (timestamp - this.last_update)/1000;
	this.orbital_position += this.orbital_speed*delta_t;
	if(this.orbital_position<0) this.orbital_position += 2*Math.PI;
	if(this.orbital_position>(2*Math.PI)) this.orbital_position -= 2*Math.PI;
	var c_coords = trig.p2c(this.orbital_distance,this.orbital_position);
	this.x = c_coords.x;
	this.y = c_coords.y;
	this.last_update = timestamp;
}

if(typeof module != 'undefined') {
	module.exports.CelestialObject = CelestialObject;
} else {
}