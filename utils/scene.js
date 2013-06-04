if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var SceneNode = function() {
	this.children = [];
}
SceneNode.prototype.add_child_node = function(child) {
	this.children.push(child);
}
SceneNode.prototype.render_children = function(timestamp) {
	_.each(this.children,function(child,index){
		child.render(timestamp);
	});
}

var Scene = function(screen,camera) {
	_.extend(this,new SceneNode())
	this.screen = screen;
	this.camera = camera;
}
Scene.prototype.render = function(timestamp) {
	var x_offset = this.camera.center_x*this.camera.magnification - this.screen.width/2;
	var y_offset = this.camera.center_y*this.camera.magnification - this.screen.height/2;

	this.screen.context.save();
	this.screen.context.translate(-x_offset,-y_offset);
	this.render_children(timestamp);
	this.screen.context.restore();
}


if(typeof module != 'undefined') {
	module.exports.SceneNode = SceneNode;
	module.exports.Scene = Scene;
} else {
}