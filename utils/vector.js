if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	Point2D = require('./point.js').Point2D; 
} 


// constructor rules
//   x1,y1,x2,y1
//   p1,p2
//   ref
//   { p1 : p , p2 : p ,p1_ref:true, p2_ref=false}

// Empty constructor sets nothing, but as soon as one point is set the other is set to the default of 0,0 if its is not specified

var Vector2D = function(dict) {
	
	if(arguments.length == 0) {					// Default empty constructor
	} else if(arguments.length == 4){
		this.p1 = new Point2D(arguments['0'],arguments['1']);
		this.p2 = new Point2D(arguments['2'],arguments['3']);
		this.init();
	} else {
		this.set(dict);
	}
}	


// Calling init assumes that p1 and p2 both exist
Vector2D.prototype.init = function() {
	var that = this;

	this.p1.bind('on_change',function() { that._update_derived_values() });
	this.p2.bind('on_change',function() { that._update_derived_values() });
	
	that._update_derived_values();
}

Vector2D.prototype.set = function(dict) {
	if(!_.isUndefined(dict.p1) || !_.isUndefined(dict.p2)) {
		if(!_.isUndefined(dict.p1)) {
			if(!_.isUndefined(dict.p1_ref) && dict.p1_ref) {
				this.p1 = dict.p1;
			} else {
				if(_.isUndefined(this.p1))
					this.p1 = new Point2D(dict.p1.x,dict.p1.y);
				else
					this.p1.set_c(dict.p1.x,dict.p1.y);
			}
		}
		if(!_.isUndefined(dict.p2)) {
			if(!_.isUndefined(dict.p2_ref) && dict.p2_ref) {
				this.p2 = dict.p2;
			} else {
				if(_.isUndefined(this.p2))
					this.p2 = new Point2D(dict.p2.x,dict.p2.y);
				else
					this.p2.set_c(dict.p2.x,dict.p2.y);
				
			}
		}
	} else {
		if(_.isUndefined(this.p1))
			this.p1 = new Point2D({x:dict.x1,y:dict.y1});
		else
			this.p1.set({x:dict.x1,y:dict.y1});
			
		if(_.isUndefined(this.p2))
			this.p2 = new Point2D({x:dict.x2,y:dict.y2});
		else
			this.p2.set({x:dict.x2,y:dict.y2});
	}
	
	if(_.isUndefined(this.p1))
		this.p1 = new Point2D(0,0);
	if(_.isUndefined(this.p2))
		this.p2 = new Point2D(0,0);
		
	this.init();	
}

Vector2D.prototype.set_c = function(x1,y1,x2,y2) {
	this.p1.set_c(x1,y1);
	this.p2.set_c(x2,y2);
}

Vector2D.prototype.translate = function(dx,dy) {
    this.p1.translate(dx,dy);
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