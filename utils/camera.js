if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

// All the inputs are in world coordinates
// Scale -> meter/pixel if scale is 0.007848 then the earth (6371m radiums) will have a radius of 50px ... The sun
// having radius of 700000 would have a radius of 5400px ... a bit to big for the screen :)
var Camera = function(x,y,magnification) {
	this.center_x = x;
	this.center_y = y;
	this.magnification = magnification;
}

Camera.prototype.translate = function(dx,dy) {
	this.center_x += dx;
	this.center_y += dy;
}

if(typeof module != 'undefined') {
    module.exports.Camera = Camera;
} else {
}