if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var GridFX = function(scene,parms) {
	this.scene = scene;

	this.color = parms.color;
	this.step = parms.step; 
}

GridFX.prototype.render = function(timestamp) {
	var x_offset = (this.scene.camera.center_x*this.scene.camera.magnification - this.scene.screen.width/2)%this.step;
	var y_offset = (this.scene.camera.center_y*this.scene.camera.magnification - this.scene.screen.height/2)%this.step;

	this.scene.screen.context.save();
	this.scene.screen.context.strokeStyle = this.color;
	
	for(var r=0;r<=this.scene.screen.height;r+=this.step) {
		this.scene.screen.context.moveTo(0,r+y_offset);
		this.scene.screen.context.lineTo(this.scene.screen.width,r+y_offset);
	}
	
	for(var c=0;c<=this.scene.screen.width;c+=this.step) {
		this.scene.screen.context.moveTo(c+x_offset,0);
		this.scene.screen.context.lineTo(c+x_offset,this.scene.screen.height);
	}

	this.scene.screen.context.stroke();
	this.scene.screen.context.restore();
}

if(typeof module != 'undefined') {
	module.exports.GridFX = GridFX;
} else {
}