var Point2D = require('../utils/point.js').Point2D;
var Vector2D = require('../utils/vector.js').Vector2D;

var Thing = function(date) {
    this.id = null;
    this.position = new Point2D(0,0);
    this.target = new Point2D(0,0);
    this.vector_to_target = new Vector2D(this.position,this.target);
    this.set(this.position,this.target,0,date);
}

Thing.prototype.set = function(p,t,v,date) {
    this.position.x = p.x;
    this.position.y = p.y;
    this.target.x = t.x;
    this.target.y = t.y;
    this.velocity = v;
    this.vector_to_target.set(this.position,this.target);
    this.last_update = date;
}

Thing.prototype.set_position = function(p,date) {
    this.position.x = p.x;
    this.position.y = p.y;
    this.vector_to_target.set_p1(this.position);
    this.last_update = date;
}

Thing.prototype.set_position_and_velocity = function(p,v,date) {
    this.position.x = p.x;
    this.position.y = p.y;
    this.velocity = v;
    this.vector_to_target.set_p1(this.position);
    this.last_update = date;
}

Thing.prototype.set_target = function(t,date) {
    this.target.x = t.x;
    this.target.y = t.y;
    this.vector_to_target.set_p2(this.target);
    this.last_update = date;
}

Thing.prototype.set_target_and_velocity = function(t,v,date) {
    this.target.x = t.x;
    this.target.y = t.y;
    this.velocity = v;
    this.vector_to_target.set_p2(this.target);
    this.last_update = date;
}

Thing.prototype.set_velocity = function(v,date) {
    this.velocity = v;
    this.last_update = date;
}

Thing.prototype.move = function(dx,dy,date) {
    this.position.translate(dx,dy);
    this.vector_to_target.set_p1(this.position);
    this.last_update = date;
}


Thing.prototype.update = function(date) {
    // Don't update stationary things
    //
    if(this.v == 0) return;                                
    
    // Don't update things that are at their target
    //
    if(this.position.x == this.target.x && this.position.y == this.target.y) return;  
    
    // Calculate the amount of seconds elapsed since the the last update
    //
    var t = (date.getTime() - this.last_update.getTime())/1000;
    
    var d = t*this.velocity; 
    
    // Set the things position to be the same as the target and set the velocity to zero if:
    // 1) The distance covered in the elapsed time is larger than the distance to the target
    // 2) The distnace to the target is very small.
    //
    if(d>this.vector_to_target.length || this.vector_to_target.length < 0.001 ) {
        this.set_position_and_velocity(this.target,0,date)
        return;
    }
   
    // Once all the special cases has been handled then calculate the new position for the 
    // thing
    //    
    var px = this.vector_to_target.dx/this.vector_to_target.length;
    var py = this.vector_to_target.dy/this.vector_to_target.length;

    this.move(d*px, d*py, date);
}

if(typeof module != 'undefined') {
    module.exports.Thing = Thing;
} else {
    alert('thing.js loaded');
}