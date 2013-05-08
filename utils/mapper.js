var _ = require('underscore');
var redis = require('redis');
var q = require('q');
var printf = require('../utils/printf.js').printf;
var construct = require('../utils/constructor.js').construct;
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
}

Mapper.prototype._create = function(client,obj) {
    var that = this;
    return q.nfcall(incr,client,obj.map.model_name).then( function(id) { 
        obj.id = id;
		return that._update(client,obj);
    })
}
Mapper.prototype._update = function(client,obj) {
    var that = this;
	var promises = [];
	_.each(obj.map.fields, function(field,field_name) {
		if(field.type == 'Simple') {
			promises.push(q.nfcall(hset,client,make_key(obj.map.model_name,obj.id),field_name,obj[field_name]));
		} else if (field.type == 'Ref') {
			if(field.internal) {
				promises.push(that.save(obj[field_name]));
			} else {
				// if not id then throw error
				
			}
		} else if (field.type == 'List') {
			if(field.internal) {
				_.each(obj[field_name],function(list_item) {
					promises.push(that.save(list_item));
				});
			} else {
				// if id not set then throw error
			}
		}
    });
	
	if(!_.isUndefined(obj.map.default_collection)) {
		promises.push(q.nfcall(sadd,client,obj.map.default_collection,obj.id));	
	}
   
    return q.all(promises);
}
Mapper.prototype._update_refs = function(client,obj) {
    var promises = [];
    var that = this;

	_.each(obj.map.fields, function(field,field_name) {
		if(field.type == 'Simple') {
		} else if(field.type == 'Ref') {
			promises.push(q.nfcall(hset,client,make_key(obj.map.model_name,obj.id),field_name,obj[field_name].id));
		} else if(field.type == 'List') {
			_.each(obj[field_name],function(list_item) {
				promises.push(q.nfcall(sadd,client,make_key(obj.map.model_name,obj.id,field_name),list_item.id));
			});
		}	
	});
    
    return q.all(promises);
}

Mapper.prototype.save = function(obj) {
    var client = redis.createClient();
	client.select(this.db_id);
    var that = this;
    if(obj.id == -1) {
        return this._create(client,obj).then(function() {
            return that._update_refs(client,obj);
        }).then(function() { 
            //printf('*Done(Create) : %s,%s\n',obj.map.model_name,obj.id);
            client.quit(); 
			return obj;
        });        
    } else {
        return this._update(client,obj).then(function() { 
            return that._update_refs(client,obj);
        }).then(function() { 
            //printf('*Done(Update) : %s,%s\n',obj.map.model_name,obj.id);
            client.quit(); 
			return obj;
        });        
    }
	
	
}

Mapper.prototype._load = function(client,map,id) {
    var promises = [];
    var that = this;
    
    var ret_val = this.create(map);
    ret_val.id = id;
 
    _.each(map.fields,function(field,field_name) {
		if(field.type == 'Simple') {
			promises.push(q.nfcall(hget,client,make_key(map.model_name,id),field_name).then(function(val) {
				ret_val[field_name] = val;
			}));
		} else if(field.type == 'Ref') {
			promises.push(q.nfcall(hget,client,make_key(map.model_name,id),field_name).then(function(val) {
				return that._load(client,field.map,val).then(function(obj) {
					ret_val[field_name] = obj;
				}); 	
			}));
		} else if(field.type == 'List') {
	        promises.push(q.nfcall(smembers,client,make_key(map.model_name,id,field_name)).then(function(ref_ids){
				var ref_promises = [];
				_.each(ref_ids,function(ref_id) {
					ref_promises.push(that._load(client,field.map,ref_id).then(function(obj) {
						//If none is loaded then we just don't add it to the ref
						// else we need to first remove the item from the ref db entry
						// this can be a non qed call since we will ignore it for this load.
						// It would only be for house keeping
						//
						ret_val[field_name].push(obj);    
					}));
				});
				return q.all(ref_promises);
			}));
		};
    });
    
    return q.all(promises).then( function() {
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
    });
}

Mapper.prototype.load = function(map,id) {
    var client = redis.createClient();
	client.select(this.db_id);
    var that = this;

	return this._load(client,map,id).then(function(obj) { 
		//printf('*Done(Loading) : %s,%s\n',obj.map.model_name,obj.id);
		client.quit(); 
		return obj;
	});        
}

Mapper.prototype.load_all = function(map) {
	var client = redis.createClient();
	client.select(this.db_id);
	
	var that = this;
	return q.nfcall(smembers,client,map.default_collection).then(function(collection_ids){
		var promises = [];		
		_.each(collection_ids,function(id){
			promises.push(that._load(client,map,id));
		});
		return q.all(promises).then(function(collection) { client.quit(); return collection; });
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