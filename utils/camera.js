if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

// All the inputs are in world coordinates
var Camera = function(x,y,width,height) {
	this.center_x = x;
	this.center_y = y;
	this.width = width;
	this.height = height;
	this._calculate_left_top();	
}

Camera.prototype.Translate = function(dx,dy) {
	this.center_x += dx;
	this.center_y += dy;
	this._calculate_left_top();
}

Camera.prototype.Scale = function(scale) {
	this.width*=scale;
	this.height*=scale;
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