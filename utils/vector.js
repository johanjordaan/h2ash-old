var _ = require('underscore');
var Point2D = require('./point.js').Point2D; 

var Vector2D = function() {
    this.p1 = new Point2D(0,0);
    this.p2 = new Point2D(0,0);
	this.set(this.p1.x,this.p1.y,this.p2.x,this.p2.y);
}

Vector2D.prototype.set = function(x1,y1,x2,y2) {
    this.p1.x = x1;
    this.p1.y = y1;
    this.p2.x = x2;
    this.p2.y = y2;
    
    this._update_derived_values();
}

Vector2D.prototype.set_p1 = function(x1,y1) {
    this.p1.x = x1;
    this.p1.y = y1;
    this._update_derived_values();
}

Vector2D.prototype.set_p2 = function(x2,y2) {
    this.p2.x = x2;
    this.p2.y = y2;
    this._update_derived_values();
}

Vector2D.prototype.translate = function(dx,dy) {
    this.p1.translate(dx,dy);
    this.p2.translate(dx,dy);
}

Vector2D.prototype.translate_p1 = function(dx,dy) {
    this.p1.translate(dx,dy);
    this._update_derived_values();
}

Vector2D.prototype.translate_p2 = function(dx,dy) {
    this.p2.translate(dx,dy);
    this._update_derived_values();
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