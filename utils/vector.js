var Point2D = require('./point.js').Point2D; 

var Vector2D = function(p1,p2) {
    this.p1 = new Point2D(0,0);
    this.p2 = new Point2D(0,0);
    this.set(p1,p2);
}

Vector2D.prototype.set = function(p1,p2) {
    this.p1.x = p1.x;
    this.p1.y = p1.y;
    this.p2.x = p2.x;
    this.p2.y = p2.y;
    
    this._update_derived_values();
}

Vector2D.prototype.set_p1 = function(p1) {
    this.p1.x = p1.x;
    this.p1.y = p1.y;
    this._update_derived_values();
}

Vector2D.prototype.set_p2 = function(p2) {
    this.p2.x = p2.x;
    this.p2.y = p2.y;
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