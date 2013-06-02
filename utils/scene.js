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
SceneNode.prototype.render_children = function(parent,timestamp) {
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
	this.render_children(this,timestamp);
}


if(typeof module != 'undefined') {
	module.exports.SceneNode = SceneNode;
	module.exports.Scene = Scene;
} else {
}