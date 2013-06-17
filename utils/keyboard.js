if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var keyboard = {
	bindings : {},
	down : [],

	bind : function() {
		var that = this;
		$(document).keyup(function(e) {
			var index = that.down.indexOf(e.keyCode)
			if(index!=-1)
				that.down.splice(index,1);
			return true;
		});
		
		$(document).keydown(function(e) {
			var index = that.down.indexOf(e.keyCode)
			if(index==-1)
				that.down.push(e.keyCode);
			return true;
		});
	},
	
	bind_key : function(key,down,up) {
		this.bindings[key] = {up:up,down:down}
	},
	update : function() {
		var that = this;
		_.each(that.down,function(keyCode){
			if(!_.isUndefined(that.bindings[keyCode]))
				that.bindings[keyCode]['down']();
		});
	}

    
	
	,key_up:38
	,key_down:40
	,key_left:37
	,key_right:39
	,key_w:87
	,key_s:83
	,key_plus:187
	,key_minus:189
}	


if(typeof module != 'undefined') {
    module.exports.keyboard = keyboard;
} else {
}