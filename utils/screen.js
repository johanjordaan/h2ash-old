if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var Screen = function(width,height,context) {
	this.width = width;
	this.height = height;
	this.context = context;
	this.aspect_ratio = width/height;
}

Screen.prototype.clear = function() {
	this.context.fillStyle = 'black';
	this.context.fillRect(0, 0, this.width, this.height);	
}

if(typeof module != 'undefined') {
	module.exports.Screen = Screen;
} else {
}