var _ = require('underscore');
var redis = require('redis');
var q = require('q');
var printf = require('../utils/printf.js').printf;
var construct = require('../utils/constructor.js').construct;
var Junction = require('../utils/junction.js').Junction;
var util = require('util');

// Redis wrappers
//
var incr = function(client,name,callback) {
	client.incr(name,callback);	
}
var hset = function(client,key,field,val,callback) {
    client.hset(key,field,val,callback);
}
var hget = function(client,key,field,callback) {
	client.hget(key,field,callback);
}
var sadd = function(client,key,val,callback) {
    client.sadd(key,val,callback);
}
var smembers = function(client,key,callback) {
	client.smembers(key,callback);
}


var make_key = function(name,id,field_name) {
	var key;
	if(_.isUndefined(field_name)) {
		key = util.format('%s:%s',name,id);
	} else {
		key = util.format('%s:%s:%s',name,id,field_name);
	}
	return key;
}


// Mapper
//
var Mapper = function(db_id) {
	if(_.isUndefined(db_id))
		this.db_id = 0;
	else
		this.db_id = db_id;
		
    this.client = redis.createClient();
	this.client.select(this.db_id);
}

Mapper.prototype._all = function(obj,stack) {
	var that = this;
	if(_.isUndefined(stack)) stack = [];
	stack.push(obj);

	_.each(obj.map.fields,function(field,field_name) {
		if(field.type == 'Ref') {
			that._all(obj[field_name],stack);
		} else if(field.type == 'List') {
			_.each(obj[field_name],function(child) {
				that._all(child,stack);
			});
		}
	});	
	
	return stack;
} 

Mapper.prototype.save = function(obj,callback) {
	var that = this;
	var j = new Junction();
	var all_objects = that._all(obj)
	_.each(all_objects,function(current_item) {
		if(current_item.id == -1) {
			j.call(incr,that.client,current_item.map.model_name,function(err,id){
				current_item.id = id;
			});
		}
	});
	j.finalise(function() {
		var j2 = new Junction();
		
		_.each(all_objects,function(current_object){
			var object_key = current_object.map.model_name+':'+current_object.id;
			_.each(current_object.map.fields,function(field,field_name){
			
				if(field.type == 'Simple') {
					j2.call(hset,that.client,object_key,field_name,current_object[field_name],function(){});
				} else if(field.type == 'Ref') {
					j2.call(hset,that.client,object_key,field_name,current_object[field_name].id,function(){});
				} else if(field.type == 'List') {
					_.each(current_object[field_name],function(child){
						j2.call(sadd,that.client,object_key+':'+field_name,child.id,function() {});
					});
				}
			});
			
			if(!_.isUndefined(current_object.map.default_collection)) {
				j2.call(sadd,that.client,current_object.map.default_collection,current_object.id);	
			}
		});
		
		j2.finalise(function(){
			callback(obj);
		});
		
	});
}

Mapper.prototype.save_all = function(obj_list,callback) {
	var that = this;
	
	var saved_obj_list = [];
	var j = new Junction();
	
	_.each(obj_list,function(obj) { 
		j.call(that,'save',obj,function(obj) {
			saved_obj_list.push(obj);
		});
	});
	
	j.finalise(function() { 
		callback(saved_obj_list);
	});
	
}

Mapper.prototype._load = function(map,id,j,callback) {
    var that = this;
    
    var obj = this.create(map);
    obj.id = id;
 
     _.each(obj.map.fields,function(field,field_name) {
		var object_key = obj.map.model_name+':'+obj.id;
		if(field.type == 'Simple') {
			j.call(hget,that.client,object_key,field_name,function(err,val){
				if(!_.isUndefined(field.conversion))
					obj[field_name] = field.conversion(val);
				else
					obj[field_name] = val;
			});
		} else if(field.type == 'Ref'){
			j.call(hget,that.client,object_key,field_name,function(err,child_id){
				that._load(field.map,parseInt(child_id),j,function(ref_obj){
					obj[field_name] = ref_obj;
				});
			});
		} else if(field.type == 'List'){
			j.call(smembers,that.client,object_key+':'+field_name,function(err,child_ids){
				_.each(child_ids,function(child_id){
					that._load(field.map,parseInt(child_id),j,function(child_obj){
						obj[field_name].push(child_obj);
					});
				});
			});
		}		
	});

/*    return q.all(promises).then( function() {
		if(!_.isUndefined(map.constructor_args)) {
			var constructor_parms = [];
			_.each(map.constructor_args,function(field_name) {
				constructor_parms.push(ret_val[field_name]);
			});
			var new_obj = construct(map.model).using.array(constructor_parms);
			new_obj.id = ret_val.id;
			new_obj.map = map;
			return new_obj;
		}
        return ret_val;    
    });*/
	
	callback(obj);
}


Mapper.prototype.load = function(map,id,callback) {
	if(_.isUndefined(map)) throw 'Map not provided for load.';
	if(_.isUndefined(id)) throw 'ID not provided for load.';
    var that = this;

	var j = new Junction();
	var obj = null;
	this._load(map,id,j,function(obj) {
		j.finalise(function(){
			// Call the constructor for each class that requires it to be called
			//
			_.each(that._all(obj),function(current_obj){
				if(!_.isUndefined(current_obj.map.constructor_args)) {
					var constructor_parms = [];
					_.each(current_obj.map.constructor_args,function(field_name) {
						constructor_parms.push(current_obj[field_name]);
					});
					current_obj.constructor.apply(current_obj,constructor_parms);
				}
			});
			callback(obj);
		});
	});
}

Mapper.prototype.load_all = function(map,callback) {
	var that = this;

	var loaded_obj_list = [];
	if(_.isUndefined(map.default_collection)) {
		callback(loaded_obj_list);
		return;
	}
	smembers(that.client,map.default_collection,function(err,obj_ids) {
		var j = new Junction();
		_.each(obj_ids,function(id){
			
			j.call(that,'load',map,id,function(loaded_obj){
				loaded_obj_list.push(loaded_obj);
			})
		});
		j.finalise(function(){
			callback(loaded_obj_list);
		})
	});
}

Mapper.prototype.create = function(map,initial_data) {
	var that = this;
	var new_obj = construct(map.model).using.parameters();
    new_obj.id = -1;
	new_obj.map = map;

	if(_.isUndefined(initial_data))
		initial_data = {};
	
	_.each(new_obj.map.fields, function(field_def,field_name) {
		if(field_name in initial_data)
			new_obj[field_name] = initial_data[field_name];
		else {
			if(field_def.type == 'Simple') 
				new_obj[field_name] = field_def.default_value;
			else if(field_def.type == 'List')
				new_obj[field_name] = [];
			else if(field_def.type == 'Ref') {
				if(field_def.internal)
					new_obj[field_name] = that.create(field_def.map);
			}
		}
	});
	
	if(!_.isUndefined(map.constructor_args)) {
		var constructor_parms = [];
		_.each(map.constructor_args,function(field_name) {
			constructor_parms.push(new_obj[field_name]);
		});
		var new_obj = construct(map.model).using.array(constructor_parms);
	    new_obj.id = -1;
		new_obj.map = map;
	}
		
    return new_obj;
} 


if(typeof module != 'undefined') {
    module.exports.Mapper = Mapper;
} else {
    alert('mapper.js cannot be used on the client side');
}