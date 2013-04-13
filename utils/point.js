var Point2D = function(x,y) {
    this.set(x,y);
}
Point2D.prototype.set = function(x,y) {
    this.x = x;
    this.y = y;
}
Point2D.prototype.translate = function(dx,dy) {
    this.set(this.x+dx, this.y+dy); 
}

if(typeof module != 'undefined') {
    module.exports.Point2D = Point2D;
} else {
    alert('point.js loaded');
}