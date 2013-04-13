var Vector2D = function(x1,y1,x2,y2) {
    this.set(x1,y1,x2,y2);
    
    return this;
}

Vector2D.prototype.set = function(x1,y1,x2,y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    
    this._update_derived_values();
}

Vector2D.prototype.set_p1 = function(x1,y1) {
    this.x1 = x1;
    this.y1 = y1;
    this._update_derived_values();
}

Vector2D.prototype.set_p2 = function(x2,y2) {
    this.x2 = x2;
    this.y2 = y2;
    this._update_derived_values();
}

Vector2D.prototype._update_derived_values = function() {
    this.dx = this.x2 - this.x1;
    this.dy = this.y2 - this.y1;
    this.d = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
}


if(typeof module != 'undefined') {
    module.exports.Vector2D = Vector2D;
} else {
    alert('vector.js loaded');
}