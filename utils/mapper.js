var _ = require('underscore');
var redis = require('redis');
var q = require('q');
var printf = require('../utils/printf.js').printf
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



// Mapper
//
var Mapper = function(map_list,db_id) {
	this.maps = {};
	_.each(map_list,function(map) {
		this.maps[map.name] = map;
	},this);
	
	if(typeof(db_id) == 'undefined')
		this.db_id = 0;
	else
		this.db_id = db_id;
}

Mapper.prototype._create = function(client,obj) {
    var that = this;
    return q.nfcall(incr,client,obj.map.name).then( function(id) { 
        obj.id = id;
		return that._update(client,obj);
    })
}
Mapper.prototype._update = function(client,obj) {
    var promises = [];
    var that = this;
	_.each(obj.map.fields, function(field,field_name) {
		if(field.type == 'Simple') {
			promises.push(q.nfcall(hset,client,util.format('%s:%s',obj.map.name,obj.id),field_name,obj[field_name]));
		} else if (field.type == 'Ref') {
			if(field.internal) {
				// Save the 
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
   
    return q.all(promises);
}
Mapper.prototype._update_refs = function(client,obj) {
    var promises = [];
    var that = this;

	_.each(obj.map.fields, function(field,field_name) {
		if(field.type == 'Simple') {
		} else if(field.type == 'Ref') {
			promises.push(q.nfcall(hset,client,util.format('%s:%s',obj.map.name,obj.id),field_name,obj.id));
		} else if(field.type == 'List') {
			_.each(obj[field_name],function(list_item) {
				promises.push(q.nfcall(sadd,client,util.format('%s:%s:%s',obj.map.name,obj.id,field_name),list_item.id));
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
            //printf('*Done(Create) : %s,%s\n',obj.map.name,obj.id);
            client.quit(); 
			return obj;
        });        
    } else {
        return this._update(client,obj).then(function() { 
            return that._update_refs(client,obj);
        }).then(function() { 
            //printf('*Done(Update) : %s,%s\n',obj.map.name,obj.id);
            client.quit(); 
			return obj;
        });        
    }
	
	
}

Mapper.prototype._load = function(client,map_name,id) {
    var map = this.maps[map_name];
    var promises = [];
    var that = this;
    
    var ret_val = this.create(map.name);
    ret_val.id = id;
 
    _.each(map.fields,function(field,field_name) {
		if(field.type == 'Simple') {
			promises.push(q.nfcall(hget,client,util.format('%s:%s',map.name,id),field_name).then(function(val) {
				ret_val[field_name] = val;
			}));
		} else if(field.type == 'Ref') {
			promises.push(q.nfcall(hget,client,util.format('%s:%s',map.name,id),field_name).then(function(val) {
				return that._load(client,field.map_name,val).then(function(obj) {
					ret_val[field_name] = obj;
				}); 	
			}));
		} else if(field.type == 'List') {
	        promises.push(q.nfcall(smembers,client,util.format('%s:%s:%s',map.name,id,field_name)).then(function(ref_ids){
				var ref_promises = [];
				_.each(ref_ids,function(ref_id) {
					ref_promises.push(that._load(client,field.map_name,ref_id).then(function(obj) {
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
        return ret_val;    
    });
}

Mapper.prototype.load = function(map_name,id) {
    var client = redis.createClient();
	client.select(this.db_id);
    var that = this;

	return this._load(client,map_name,id).then(function(obj) { 
		//printf('*Done(Loading) : %s,%s\n',obj.map.name,obj.id);
		client.quit(); 
		return obj;
	});        
}

Mapper.prototype.create = function(map_name,initial_data) {
    var map = this.maps[map_name];
    var new_obj = new map.model();
    new_obj.id = -1;
	new_obj.map = map;

	if(typeof(initial_data) == 'undefined')
		initial_data = {};
	
	_.each(new_obj.map.fields, function(field_def,field_name) {
		if(field_name in initial_data)
			new_obj[field_name] = initial_data[field_name];
		else {
			if(field_def.type == 'Simple') 
				new_obj[field_name] = field_def.default_value;
			else if(field_def.type == 'List')
				new_obj[field_name] = [];
		}
	});
	
    return new_obj;
} 


if(typeof module != 'undefined') {
    module.exports.Mapper = Mapper;
} else {
    alert('mapper.js cannot be used on the client side');
}