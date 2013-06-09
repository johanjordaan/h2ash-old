if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var Mock = function(arg) {
	var source,methods;
	if(_.isArray(arg) || _.isUndefined(arg)) {
		methods = arg;
		source = this;
	} else {
		source = arg;
		source._add_method = Mock.prototype._add_method;
		source.expect = Mock.prototype.expect;
		source.validate = Mock.prototype.validate;
	}
	
	var that = source;		
	that.methods = {};			// { func : { method_name:'func',mock_funcs:[],func_idx,call_count:0 } }
	that.expected_calls = []; 	// List of {method_name:'func',expected_args:[],callback:callback}
	that.actual_calls = []; 	// List of {method_name:'func',actual_args:[]}
		
	_.each(methods,function(method_name){
		that._add_method(method_name);
	});
	
	return source;
}
Mock.prototype._add_method = function(method_name) {
	var that = this;
	if(!_.has(that.methods,method_name)) {
		that.methods[method_name] = { 
			method_name:method_name,
			default_mock_func:function() {
				that.methods[method_name].call_count++;
			}, 
			mock_funcs:[],
			func_idx:0,
			call_count:0 
		};
		that[method_name] = function() {
			var args = Array.prototype.slice.call(arguments, 0);
			var method_def = that.methods[method_name];
			if(method_def.mock_funcs.length==0) return method_def.default_mock_func.apply(that,args); 
			var f =  method_def.mock_funcs[method_def.func_idx];
			if(method_def.func_idx<method_def.mock_funcs.length-1)
				method_def.func_idx++;
			return f.apply(that,args);
		}
	}
}


Mock.prototype.expect = function(method_name,expected_args,callback) {
	var that = this;		
	that._add_method(method_name);
	that.expected_calls.push({method_name:method_name,expected_args:expected_args,callback:callback});
		
	that.methods[method_name].mock_funcs.push(function() {
		var args = Array.prototype.slice.call(arguments, 0);
		var ret_val;
		if(!_.isUndefined(callback))
			ret_val = callback(that,arguments);
		that.actual_calls.push({method_name:method_name,actual_args:args});
		that.methods[method_name].call_count++;
		return ret_val;
	});
}

Mock.prototype.validate = function(display_messages) {
	var that = this;		
	var ret_val = {status:'ok',messages:[]};
	
	if(that.expected_calls.length>that.actual_calls.length)
		ret_val.messages.push('Number of expected calls ['+that.expected_calls.length+'] exceeds number of actual calls ['+that.actual_calls.length+']')
	
	_.each(that.expected_calls,function(expected_call,call_index) {
		if(call_index>=that.actual_calls.length) {
			ret_val.messages.push('Expected call ['+expected_call.method_name+'] but no call was made');
		} else {	
			var actual_call = that.actual_calls[call_index];
			if(expected_call.method_name == actual_call.method_name ) {
				_.each(expected_call.expected_args,function(expected_arg,arg_index){
					var actual_arg = actual_call.actual_args[arg_index];
					// Need to handle lists and objects ...
					if(expected_arg == actual_arg) {
					} else {
						ret_val.messages.push('Expected argument ['+arg_index+'] on call ['+expected_call.method_name+'] to be ['+expected_arg+'] but actually was ['+actual_arg+']');
					}
				});
			} else {
				ret_val.messages.push('Expected call ['+expected_call.method_name+'] but actual call was ['+actual_call.method_name+']');
			}
		}
	});
	if(ret_val.messages.length>0)
		ret_val.status = 'error'
		
	if(!_.isUndefined(display_messages) && display_messages==true) {
		if(ret_val.status == 'error')
			console.log('------------------');
		_.each(ret_val.messages,function(message,index){
			console.log(index+') '+message)
		});
	}
		
	return ret_val;
}

if(typeof module != 'undefined') {
	module.exports.Mock = Mock;
} else {
}