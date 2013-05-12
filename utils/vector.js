var _ = require('underscore');
var Point2D = require('./point.js').Point2D; 

var Vector2D = function(a,b,c,d) {
	
	if(arguments.length == 0) {					// Default empty constructor
	} else if(arguments.length == 2) {			// Create copy of two points
		this.p1 = new Point2D(a.x,a.y);
		this.p2 = new Point2D(b.x,b.y);
		this.init();
	} else if(arguments.length == 3) {			// Create a ref of the points (add a thirt component as true to get a ref on construction)
		if(c==true) {
			this.set_r(a,b);
		} 
	}else {										// Create bthe points from components
		this.p1 = new Point2D(a,b);
		this.p2 = new Point2D(c,d);
		this.init();
	}
}	

Vector2D.prototype.init = function() {
	var that = this;

	this.p1.bind('on_change',function() { that._update_derived_values() });
	this.p2.bind('on_change',function() { that._update_derived_values() });
	
	that._update_derived_values();
}

// Ref set
//
Vector2D.prototype.set_r = function(p1,p2) {
    this.p1 = p1;
	this.p2 = p2;
	this.init();
}
Vector2D.prototype.set_p1_r = function(p1) {
    this.p1 = p1;
	this.init();
}
Vector2D.prototype.set_p2_r = function(p2) {
    this.p2 = p2;
	this.init();
}


// Set the components of the existing objects
//
Vector2D.prototype.set_c = function(x1,y1,x2,y2) {
    this.p1.set_c(x1,y1);
	this.p2.set_c(x2,y2);
}
Vector2D.prototype.set_p1_c = function(x1,y1) {
    this.p1.set_c(x1,y1);
}
Vector2D.prototype.set_p2_c = function(x2,y2) {
	this.p2.set_c(x2,y2);
}

// Default set from domain
//
Vector2D.prototype.set = function(p1,p2) {
    this.p1.set(p1);
	this.p2.set(p2);
}
Vector2D.prototype.set_p1 = function(p1) {
    this.p1.set(p1);
}
Vector2D.prototype.set_p2 = function(p2) {
    this.p2.set(p2);
}



Vector2D.prototype.translate = function(dx,dy) {
    this.p1.translate(dx,dy);
    this.p2.translate(dx,dy);
}

Vector2D.prototype.translate_p1 = function(dx,dy) {
    this.p1.translate(dx,dy);
}

Vector2D.prototype.translate_p2 = function(dx,dy) {
    this.p2.translate(dx,dy);
}

Vector2D.prototype._update_derived_values = function() {
    this.dx = this.p2.x - this.p1.x;
    this.dy = this.p2.y - this.p1.y;
    this.length = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
}

if(typeof module != 'undefined') {
    module.exports.Vector2D = Vector2D;
} else {
    alert('vector.js loaded');
}