var _ = require('underscore');

var Point2D = function(dict) {
	this.handlers = { on_change : [] };

	if(arguments.length == 0) {
	} else if(arguments.length == 2){
		this.set_c(arguments['0'],arguments['1']);
	} else {
		this.set(dict);
	}
}
Point2D.prototype.init = function() {
}

Point2D.prototype.bind = function(key,func) {
	this.handlers[key].push(func);
}
Point2D.prototype._call_handlers = function(key) {
	_.each(this.handlers[key],function(handler) {
		handler();
	});
}

Point2D.prototype.set_c = function(x,y) {
    this.x = x;
    this.y = y;
	this._call_handlers('on_change');
}
Point2D.prototype.set = function(dict) {
	if(arguments.length == 0) return;

    if(!_.isUndefined(dict.source)) {
		this.x = dict.source.x;
		this.y = dict.source.y;
	} else {
		if(!_.isUndefined(dict.x)) {
			this.x = dict.x;
		}

		if(!_.isUndefined(dict.y)) {
			this.y = dict.y;
		}
	}

	this._call_handlers('on_change');
}


Point2D.prototype.translate = function(dx,dy) {
    this.set_c(this.x+dx, this.y+dy); 
	this._call_handlers('on_change');
}

if(typeof module != 'undefined') {
    module.exports.Point2D = Point2D;
} else {
    alert('point.js loaded');
}