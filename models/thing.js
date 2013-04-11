var Thing = function(date) {
    this.id = null;
    set_thing_position(this,0,0,date); 
    set_thing_target_position(this,0,0,date); 
    set_thing_velocity(this,0,date);
}
var update_thing = function(thing,date) {
    // Don't update stationary things
    //
    if(thing.v == 0) return;                                
    
    // Don't update things that are at their target
    //
    if(thing.x == thing.tx && thing.y == thing.ty) return;  
    
    // Calculate the amount of seconds elapsed since the the last update
    //
    var t = (date.getTime() - thing.last_update.getTime())/1000;
    
    // Calculate the distance from the current position to the target
    // 
    var dx = (thing.tx - thing.x);
    var dy = (thing.ty - thing.y);
    var r = Math.sqrt(dx*2 + dy*2);
    
    // Set the things position to be the same as the target and set the velocity to zero if:
    // 1) The distance covered in the elapsed time is larger than the distance to the target
    // 2) The distnace to the target is very small.
    //
    if(t*thing.v>r || r < 0.001 ) {
        set_thing_position(thing,thing.tx,thing.ty,date); 
        set_thing_velocity(thing,0,date);
        return;
    }
   
    var px = dx/r;
    var py = dy/r;

    var nx = thing.x + thing.v * px * t;
    var ny = thing.y + thing.v * py * t;

    set_thing_position(thing,nx,ny,date); 
}

var set_thing_position = function(thing,x,y,date) {
    thing.x = x;
    thing.y = y;
    thing.last_update = date;
    
}

var set_thing_target_position = function(thing,tx,ty,date) {
    thing.tx = tx;
    thing.ty = ty;
    thing.last_update = date;
}

var set_thing_target = function(thing,target,date) {
}

var set_thing_velocity = function(thing,v,date) {
    thing.v = v;
    thing.last_update = date;
}


if(typeof module != 'undefined') {
    module.exports.Thing = Thing;
    module.exports.set_thing_position = set_thing_position;
    module.exports.set_thing_target_position = set_thing_target_position;
    module.exports.set_thing_velocity = set_thing_velocity;
    module.exports.update_thing = update_thing;
} else {
    alert('Thing loaded');
}