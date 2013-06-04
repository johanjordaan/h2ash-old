if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	SceneNode = require('../utils/scene.js').SceneNode;
}

var PlanetFX = function(scene,parms) {
	_.extend(this,new SceneNode());
	
	if(_.isUndefined(parms.parent)) {
		scene.add_child_node(this);	
	}
	else {
		parms.parent.add_child_node(this);	
		this.parent = parms.parent;
	}
	
	this.scene = scene;

	this.x = parms.x;
	this.y = parms.y;

	this.color = parms.color;
	this.radius = parms.radius; 
	this.label = parms.label;
	
}

PlanetFX.prototype.render = function(timestamp) {
	var radius = Math.floor(this.radius*this.scene.camera.magnification);
	if(radius<2) radius = 2;
	var x = this.x*this.scene.camera.magnification;
	var y = this.y*this.scene.camera.magnification;
	
	this.scene.screen.context.save();
	this.scene.screen.context.strokeStyle = this.color;

	this.scene.screen.context.beginPath();
	this.scene.screen.context.translate(x,-1*y);
	this.scene.screen.context.arc(0,0,radius,0,2*Math.PI,false);
	this.scene.screen.context.stroke();
	
	this.scene.screen.context.beginPath();
	var label_start = Math.sqrt((radius*radius)/2);
	this.scene.screen.context.strokeStyle = 'gray';
	this.scene.screen.context.moveTo(label_start+2,label_start+2);
	this.scene.screen.context.lineTo(radius+6,radius+6);
	this.scene.screen.context.font = '11px Arial';
	this.scene.screen.context.fillStyle = 'gray';
	this.scene.screen.context.fillText(this.label, radius+6, radius+1);
	var metrics = this.scene.screen.context.measureText(this.label);
	this.scene.screen.context.lineTo(radius+6+metrics.width,radius+6);
	this.scene.screen.context.stroke();
	
	this.render_children(this,timestamp)
	
	this.scene.screen.context.restore();	
}

if(typeof module != 'undefined') {
	module.exports.PlanetFX = PlanetFX;
} else {
}