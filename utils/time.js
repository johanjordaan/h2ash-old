if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var get_timestamp = function() {
	if(typeof module != 'undefined') {
		var t = process.hrtime(); //[s,ns]
		var ret_val = ((t[0]*1e9 +t[1])/1e6);
		return ret_val;
	}
	else
		return window.performance.now();
}

if(typeof module != 'undefined') {
	module.exports.get_timestamp = get_timestamp;
} else {
}