var Thing = function(date) {
    this.id = null;
    set_thing_position(this,0,0,date); 
    set_thing_target_position_and_velocity(this,0,0,0,date); 
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
    var r = Math.sqrt(dx*dx + dy*dy);
    var d = t*thing.v; 
    
    // Set the things position to be the same as the target and set the velocity to zero if:
    // 1) The distance covered in the elapsed time is larger than the distance to the target
    // 2) The distnace to the target is very small.
    //
    if(d>r || r < 0.001 ) {
        set_thing_position_and_velocity(thing,thing.tx,thing.ty,0,date)
        return;
    }
   
    // Once all the special cases has been handled then calculate the new position for the 
    // thing
    //    
    var px = dx/r;
    var py = dy/r;

    move_thing(thing, d*px, d*py, date);
}

var set_thing_position = function(thing,x,y,date) {
    thing.x = x;
    thing.y = y;
    thing.last_update = date;
}

var set_thing_position_and_velocity = function(thing,x,y,v,date) {
    thing.x = x;
    thing.y = y;
    thing.v = v;
    thing.last_update = date;
}


var move_thing = function(thing,dx,dy,date) {
    set_thing_position(thing,thing.x+dx,thing.y+dy,date); 
}
var set_thing_target_position = function(thing,tx,ty,date) {
    thing.tx = tx;
    thing.ty = ty;
    thing.last_update = date;
}
var set_thing_target_position_and_velocity = function(thing,tx,ty,v,date) {
    thing.tx = tx;
    thing.ty = ty;
    thing.v = v;
    thing.last_update = date;
}
var set_thing_velocity = function(thing,v,date) {
    thing.v = v;
    thing.last_update = date;
}


if(typeof module != 'undefined') {
    module.exports.Thing = Thing;
    module.exports.set_thing_position = set_thing_position;
    module.exports.set_thing_position_and_velocity = set_thing_position_and_velocity;
    module.exports.move_thing = move_thing;
    module.exports.set_thing_target_position = set_thing_target_position;
    module.exports.set_thing_target_position_and_velocity = set_thing_target_position_and_velocity;
    module.exports.set_thing_velocity = set_thing_velocity;
    module.exports.update_thing = update_thing;
} else {
    alert('Thing loaded');
}