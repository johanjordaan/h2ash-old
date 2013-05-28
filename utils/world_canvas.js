if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var WorldCanvas = function(width,height,context) {
	this.width = width;
	this.height = height;
	this.context = context;
}

WorldCanvas.prototype.clear = function() {
	this.context.fillStyle = 'black';
	this.context.fillRect(0, 0, this.width, this.height);	
}

WorldCanvas.prototype.draw_grid = function(world_x,world_y,size) {
	this.context.save();
	this.context.strokeStyle = '#505050';
	//context.setLineDash([3,6]); /// Not supported in IE
	
	var offset_x = world_x%size;
	var offset_y = world_y%size;
	
	for(var r=0;r<this.height;r+=size) {
		this.context.moveTo(0,r+offset_y);
		this.context.lineTo(this.width,r+offset_y);
	}
	
	for(var c=0;c<this.width;c+=size) {
		this.context.moveTo(c+offset_x,0);
		this.context.lineTo(c+offset_x,this.height);
	}

	//context.fillStyle = "#303030";
	//context.font = "20px Arial";
	//for(var r=0,rc=0;r<canvas.height;r+=size,rc++) {
	//	for(var c=0,cc=0;c<canvas.width;c+=size,cc++) {
	//		if(rc%5==0 && cc%5==0)
	//			context.fillText('('+c+','+r+')', c+offset_x, r+offset_y);
	//	}
	//}
	
	this.context.stroke();
	this.context.restore();
} 


if(typeof module != 'undefined') {
	module.exports.WorldCanvas = WorldCanvas;
} else {
}