var Point2D = require('../utils/point.js').Point2D;
var Vector2D = require('../utils/vector.js').Vector2D;

var Thing = function(date) {
    this.id = null;
    this.set(new Point2D(0,0), new Point2D(0,0), 0, date);
}

Thing.prototype.set = function(p,t,v,date) {
    this.position = p;
    this.target = t;
    this.velocity = v;
    this.last_update = date;
}

Thing.prototype.set_position = function(p,date) {
    this.position = p;
    this.last_update = date;
}

Thing.prototype.set_position_and_velocity = function(p,v,date) {
    this.position = p;
    this.velocity = v;
    this.last_update = date;
}

Thing.prototype.set_target = function(t,date) {
    this.target = t;
    this.last_update = date;
}

Thing.prototype.set_target_and_velocity = function(t,v,date) {
    this.target = t;
    this.velocity = v;
    this.last_update = date;
}



/*

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
    var r = vector.distance(thing.x,thing.y,thing.tx,thing.ty)
    
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
    var components = vector.components(thing.x,thing.y,thing.tx,thing.ty);
    var px = components[0]/r;
    var py = components[1]/r;

    move_thing(thing, d*px, d*py, date);
}


var move_thing = function(thing,dx,dy,date) {
    set_thing_position(thing,thing.x+dx,thing.y+dy,date); 
}
var set_thing_velocity = function(thing,v,date) {
    thing.v = v;
    thing.last_update = date;
}
*/

if(typeof module != 'undefined') {
    module.exports.Thing = Thing;
} else {
    alert('thing.js loaded');
}