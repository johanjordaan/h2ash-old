if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

// All the inputs are in world coordinates
var Camera = function(x,y,width,aspect_ratio) {
	this.center_x = x;
	this.center_y = y;
	this.width = width;
	this.height = width/aspect_ratio;
	this._calculate_left_top();	
	this.magnification = 1;
}

Camera.prototype.translate = function(dx,dy) {
	this.center_x += dx;
	this.center_y += dy;
	this._calculate_left_top();
}

Camera.prototype.scale = function(magnification) {
	this.magnification = magnification;
	this.width*=magnification;
	this.height*=magnification;
	this._calculate_left_top();
}

Camera.prototype._calculate_left_top = function() {
	this.left_top_x = this.center_x - this.width/2;
	this.left_top_y = this.center_y - this.height/2;	
}


if(typeof module != 'undefined') {
    module.exports.Camera = Camera;
} else {
}