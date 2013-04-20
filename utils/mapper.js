var _ = require('underscore')

var Mapper = function(maps) {
    this.maps = maps;
}
Mapper.prototype._find_map = function(obj) {
    for(var mi=0;mi<this.maps.length;mi++) {
        if(obj instanceof this.maps[mi].model) {
            return this.maps[mi];
        }
    }
}
Mapper.prototype._build_stack = function(obj,stack) {
    if(obj.map == null)
        obj.map = this._find_map(obj);
    //console.log('-->'+map.name+'-->'+obj.id)
    stack.push(obj);
    if(obj.map.refs != null) {
        for(var ri=0;ri<obj.map.refs.length;ri++) {
            var ref_field_name = obj.map.refs[ri];
            for(var o=0;o<obj[ref_field_name].length;o++) {
                obj[ref_field_name][o].parent = obj;            
                this._build_stack(obj[ref_field_name][o],stack);
            }
        }
     }
}

Mapper.prototype.save = function(obj) {
    var stack = [];
    this._build_stack(obj,stack);

    var client = redis.createClient();
    var multi = client.multi();
    for(var i=0;i<stack.length;i++) {
        var obj = stack[i];
        if(obj.id == -1) {
            multi.incr(obj.map.name);
        }
    }
    
    multi.exec(function(err,replies){
        // Update the relevant ID's
        //
        var ri = 0;
        for(var i=0;i<stack.length;i++) {
            var obj = stack[i]
            if(obj.id == -1) {
                stack[i].id = replies[ri];
                ri = ri +1;
            }
        }

        for(var i=0;i<stack.length;i++) {
            var obj = stack[i]
            var obj_key = obj.map.name+':'+obj.id;
            
            // Save the simple fields
            //
            for(var fi=0;fi<obj.map.fields.length;fi++) {
                var field_name = obj.map.fields[fi];
                client.hset(obj_key,field_name,obj[field_name])
            }
            
            // Save the ref fields
            //
            if(obj.map.refs != null) {
                for(var ri=0;ri<obj.map.refs.length;ri++) {
                    var field_name = obj.map.refs[ri];
                    for(var di=0;di<obj[field_name].length;di++) {    
                        client.rpush(obj_key+':'+field_name,obj[field_name][di].id)  
                    }
                }
            }
        }
        
        client.quit();
    })
}

Mapper.prototype._find_map_cls = function(cls) {
    for(var mi=0;mi<this.maps.length;mi++) {
        if(cls == this.maps[mi].model) {
            return this.maps[mi];
        }
    }
}

Mapper.prototype.load = function(cls,id) {
    var map = this._find_map_cls(cls);
    console.log(map.name);
}

var Person = function(name,email) {
    this.id = -1;
    this.name = name;
    this.email = email;
    this.accounts = [];
}
var Account = function(type) {
    this.id = -1;
    this.type = type;
}

var person_map = {
    model : Person,
    name : 'Person',
    fields : ['name','email'],
    refs : ['accounts']
};
var account_map = {
    model : Account,
    name : 'Account',
    fields : ['type']
};

var redis = require("redis");

var johan = new Person('Johan','johan@here.com');
//var johan_savings = new Account('Savings');
//var johan_home_loan = new Account('Home Loan');
//johan.accounts.push(johan_savings);
//johan.accounts.push(johan_home_loan);

var mapper = new Mapper([person_map,account_map]);
//mapper.save(johan);
//console.log(johan);

var johan_load = mapper.load(Person,1);
console.log(johan_load)

