if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	mapper = require('../utils/mapper.js');
}

var ShipType = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
}
ShipType.prototype.set = function(source) {
	mapper.update(this.map,this,source);
};


if(typeof module != 'undefined') {
	module.exports.ShipType = ShipType;
} else {
}