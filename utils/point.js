var _ = require('underscore');

var Point2D = function(x,y) {
	if(_.isUndefined(x) && _.isUndefined(this.x)) { x = 0; }
	if(_.isUndefined(y) && _.isUndefined(this.y)) { y = 0; }
	
	this.handlers = { on_change : [] };
    this.set(x,y);
}
Point2D.prototype.bind = function(key,func) {
	this.handlers[key].push(func);
}
Point2D.prototype._call_handlers = function(key) {
	_.each(this.handlers[key],function(handler) {
		handler();
	});
}

Point2D.prototype.set = function(x,y) {
    this.x = x;
    this.y = y;
	this._call_handlers('on_change');
}
Point2D.prototype.translate = function(dx,dy) {
    this.set(this.x+dx, this.y+dy); 
	this._call_handlers('on_change');
}

if(typeof module != 'undefined') {
    module.exports.Point2D = Point2D;
} else {
    alert('point.js loaded');
}