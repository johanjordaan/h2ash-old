if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	get_timestamp = require('../utils/time.js').get_timestamp;
}

var Scene = function(screen,camera) {
	this.screen = screen;
	this.camera = camera;
	this.nodes = [];
}

Scene.prototype.render = function() {
	var timestamp = get_timestamp();
	_.each(this.nodes,function(node,index){
		node.render(timestamp);
	});
}

if(typeof module != 'undefined') {
	module.exports.Scene = Scene;
} else {
}