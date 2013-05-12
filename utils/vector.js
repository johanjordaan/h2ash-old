var _ = require('underscore');
var Point2D = require('./point.js').Point2D; 

var Vector2D = function(x1,y1,x2,y2) {
	var that = this;
	
	if(_.isUndefined(x1) && _.isUndefined(y1)) { x1 = 0; y1 = 0 };
	if(_.isUndefined(x2) && _.isUndefined(y2)) { x2 = 0; y2 = 0 };

	if(_.isUndefined(this.p1)) { this.p1 = new Point2D(x1,y1); } else { this.p1.set(x1,y1); }
	if(_.isUndefined(this.p2)) { this.p2 = new Point2D(x2,y2); } else { this.p2.set(x2,y2); }
	
	this.p1.bind('on_change',function() { that._update_derived_values() });
	this.p2.bind('on_change',function() { that._update_derived_values() });
	
	that._update_derived_values();
}

Vector2D.prototype.set = function(x1,y1,x2,y2) {
    this.p1.set(x1,y1);
	this.p2.set(x2,y2);
}

Vector2D.prototype.set_p1 = function(x1,y1) {
    this.p1.set(x1,y1);
}

Vector2D.prototype.set_p2 = function(x2,y2) {
    this.p2.set(x2,y2);
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