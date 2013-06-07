if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var GridFX = function(scene,parms) {
	_.extend(this,new SceneNode());
	scene.add_child_node(this);	
	
	if(_.isUndefined(parms.parent)) {
		scene.add_child_node(this);	
	}
	else {
		parms.parent.add_child_node(this);	
		this.parent = parms.parent;
	}
	
	this.scene = scene;

	this.color = parms.color;
	this.step = parms.step; 
}

GridFX.prototype.render = function(timestamp) {
	var x_offset = (this.scene.camera.center_x*this.scene.camera.magnification - this.scene.screen.width/2)%this.step;
	var y_offset = (this.scene.camera.center_y*this.scene.camera.magnification - this.scene.screen.height/2)%this.step;

	this.scene.screen.context.save();
	this.scene.screen.context.setTransform(1, 0, 0, 1, 0, 0);				// Reset the transform
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