var _ = require('underscore');

// A junction is a construct that basicall synchronises a set of calls.
// It has a call : call(func,args...) ... If the last args is a function
// it is assumed that its a contnuation. This continuation is then wrapped in our own 
// management code. 
//

var Junction = function() {
	this.count = 0;
	this.ret_vals = [];
}
Junction.prototype.call = function(func) {
	var that = this;
	
	// It is assumed that func is a function and that the last of its arguments is a callback
	// The callback is replaced with our own wrapper and called within the context of the wrapper
	// 
	
	var args = Array.prototype.slice.call(arguments, 1);
	var old_callback = args[args.length-1];
	
	if(typeof(old_callback) == 'function') {
		this.count = this.count+1;	
		args[args.length-1] = function() {
			var args2 = Array.prototype.slice.call(arguments);
			that.ret_vals.push(old_callback.apply(this,args2));
			that.count = that.count-1;
			if(that.count==0) 
				if(!_.isUndefined(that.f))
					that.f(that.ret_vals);
		}
		func.apply(this,args);
	} else {
		that.ret_vals.push(func.apply(this,args));
	}
}
Junction.prototype.finalise = function(f) {
	if(this.count==0) 
		f(this.ret_vals);
	else
		this.f = f;
}

if(typeof module != 'undefined') {
    module.exports.Junction = Junction;
} else {
    alert('junction.js loaded');
}
