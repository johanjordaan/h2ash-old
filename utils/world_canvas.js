if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var WorldCanvas = function(width,height,context) {
	this.width = width;
	this.height = height;
	this.context = context;

	this.world_x = 0;
	this.world_y = 0;
}

WorldCanvas.prototype.clear = function() {
	this.context.fillStyle = 'black';
	this.context.fillRect(0, 0, this.width, this.height);	
}

WorldCanvas.prototype.draw_grid = function(step_size) {
	this.context.save();
	this.context.strokeStyle = '#505050';
	
	var offset_x = this.world_x%step_size;
	var offset_y = this.world_y%step_size;
	
	for(var r=0;r<this.height;r+=step_size) {
		this.context.moveTo(0,r+offset_y);
		this.context.lineTo(this.width,r+offset_y);
	}
	
	for(var c=0;c<this.width;c+=step_size) {
		this.context.moveTo(c+offset_x,0);
		this.context.lineTo(c+offset_x,this.height);
	}

	this.context.stroke();
	this.context.restore();
} 

WorldCanvas.prototype.draw_object = function(x,y,radius,label,color) {
	this.context.save();
	this.context.strokeStyle = color;

	this.context.beginPath();
	this.context.translate(x+this.world_x,-1*y+this.world_y);
	this.context.arc(0,0,radius,0,2*Math.PI,false);
	
	this.context.moveTo(radius+1,radius+1);
	this.context.lineTo(radius+6,radius+6);
	this.context.font = '11px Arial';
	this.context.fillStyle = color;
	this.context.fillText(label, radius+6, radius+1);
	var metrics = this.context.measureText(label);
	this.context.lineTo(radius+6+metrics.width,radius+6);

	
	
	this.context.stroke();
	this.context.restore();	
}

WorldCanvas.prototype.translate = function(dx,dy) {
	this.world_x+=dx;
	this.world_y+=dy;
} 



if(typeof module != 'undefined') {
	module.exports.WorldCanvas = WorldCanvas;
} else {
}