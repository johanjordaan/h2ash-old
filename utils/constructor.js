var construct = function(cls) {
	return new function(){
		this.cls = cls;
		var that = this;
		this.using = {
			parameters : function() {
				var args = Array.prototype.slice.call(arguments, 0);
				return this.array(args);
			},
			array : function(args) {
				var ret_val = function() {
					return that.cls.apply(this, args);
				};
				ret_val.prototype = that.cls.prototype;
				return new ret_val();
			}
		}
	}
}

if(typeof module != 'undefined') {
    module.exports.construct = construct;
} else {
    alert('constructor.js loaded');
}