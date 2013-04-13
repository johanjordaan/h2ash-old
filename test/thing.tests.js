var assert = require('assert')

var Point2D = require('../utils/point.js').Point2D;
var Thing = require('../models/thing.js').Thing;

var assert_thing_values = function(thing,id,x,y,tx,ty,v,last_update) {
    assert.equal(thing.id,id)
    assert.equal(thing.position.x,x);
    assert.equal(thing.position.y,y);
    assert.equal(thing.target.x,tx);
    assert.equal(thing.target.y,ty);
    assert.equal(thing.velocity,v);
    assert.equal(thing.last_update,last_update);
}

describe('Thing', function() {
    describe('#constructor', function() {
        it('should create a new thing with all values set to the defaults', function() {
            var t = new Date();
            var thing = new Thing(t);
            assert_thing_values(thing,null, 0,0, 0,0, 0, t);
        })
    })
})

describe('Thing', function() {
    describe('#set', function() {
        it('should set position, target and velocity of a thing', function() {
            var t = new Date();
            var thing = new Thing(t);
            thing.set(new Point2D(10,10),new Point2D(20,20),9,t);
            assert_thing_values(thing,null, 10,10, 20,20, 9, t);
        })
    })
})

describe('Thing', function() {
    describe('#set_position', function() {
        it('should set the position of a thing', function() {
            var t = new Date();
            var thing = new Thing(t);
            thing.set_position(new Point2D(10,10),t);
            assert_thing_values(thing,null, 10,10, 0,0, 0, t);
        })
    })
})

describe('Thing', function() {
    describe('#set_position_and_velocity', function() {
        it('should set the position and velocity of a thing', function() {
            var t = new Date();
            var thing = new Thing(t);
            thing.set_position_and_velocity(new Point2D(10,10),9,t);
            assert_thing_values(thing,null, 10,10, 0,0, 9, t);
        })
    })
})

describe('Thing', function() {
    describe('#set_target', function() {
        it('should set the target of a thing', function() {
            var t = new Date();
            var thing = new Thing(t);
            thing.set_target(new Point2D(10,10),t);
            assert_thing_values(thing,null, 0,0, 10,10, 0, t);
        })
    })
})

describe('Thing', function() {
    describe('#set_target_and_velocity', function() {
        it('should set the target and velocity of a thing', function() {
            var t = new Date();
            var thing = new Thing(t);
            thing.set_target_and_velocity(new Point2D(10,10),7,t);
            assert_thing_values(thing,null, 0,0, 10,10, 7, t);
        })
    })
})


/*
describe('#set_thing_position', function() { 
    it('should set the position of a thing to the correct values', function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.set_thing_position(thing,2,0,t);
        assert_thing_values(thing,null, 2,0, 0,0, 0, t);
        things.set_thing_position(thing,-2,3,t);
        assert_thing_values(thing,null, -2,3, 0,0, 0, t);
        things.set_thing_position(thing,3,-4,t);
        assert_thing_values(thing,null, 3,-4, 0,0, 0, t);
    })
})

describe('#set_thing_position_and_velocity', function() { 
    it('should set the position of a thing to the correct values', function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.set_thing_position_and_velocity(thing,2,0,3,t);
        assert_thing_values(thing,null, 2,0, 0,0, 3, t);
        things.set_thing_position_and_velocity(thing,-2,3,2,t);
        assert_thing_values(thing,null, -2,3, 0,0, 2, t);
        things.set_thing_position_and_velocity(thing,3,-4,5,t);
        assert_thing_values(thing,null, 3,-4, 0,0, 5, t);
    })
})


describe('#set_thing_target_position', function() { 
    it('should set the target position of a thing to the correct values', function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.set_thing_target_position(thing,-2,0,t);
        assert_thing_values(thing,null, 0,0, -2,0, 0, t);
        things.set_thing_target_position(thing,2,1,t);
        assert_thing_values(thing,null, 0,0, 2,1, 0, t);
        things.set_thing_target_position(thing,-3,4,t);
        assert_thing_values(thing,null, 0,0, -3,4, 0, t);
    })
})

describe('#set_thing_target_position_and_velocity', function() {
    it('should set the position and velocity of a thing to the correct values', function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.set_thing_target_position_and_velocity(thing,-2,0,2,t);
        assert_thing_values(thing,null, 0,0, -2,0, 2, t);
        things.set_thing_target_position_and_velocity(thing,2,1,5,t);
        assert_thing_values(thing,null, 0,0, 2,1, 5, t);
        things.set_thing_target_position_and_velocity(thing,-3,4,0,t);
        assert_thing_values(thing,null, 0,0, -3,4, 0, t);
    })
})


describe('#set_thing_velocity', function() { 
    it('should set the valocity of a thing to the correct values (negative values are allowed)', function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.set_thing_velocity(thing,30,t);
        assert_thing_values(thing,null, 0,0, 0,0, 30, t);
        things.set_thing_velocity(thing,-20,t);
        assert_thing_values(thing,null, 0,0, 0,0, -20, t);
    })
})

describe('#update_thing', function() {
    it('should not update a stationary (v=0) thing',function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.update_thing(thing,t);
        assert_thing_values(thing,null, 0,0, 0,0, 0, t);
    })
    
    it('should not update a thing at its target position',function() {
        var t = new Date();
        var thing = new things.Thing(t);
        things.set_thing_position(thing,2,2,t);
        things.set_thing_target_position(thing,2,2,t);
        things.update_thing(thing,t);
        assert_thing_values(thing,null, 2,2, 2,2, 0, t);
    })
    
    it('should set the things position to be the same as target position if a long time has elapsed',function() {
        var t1 = new Date(2000,1,1,10,9,0,0);
        var t2 = new Date(2010,1,1,10,9,2,0);
        var thing = new things.Thing(t1);
        things.set_thing_target_position(thing,100,100,t1);
        things.set_thing_velocity(thing,1,t1);
        things.update_thing(thing,t2);
        assert_thing_values(thing,null, 100,100, 100,100, 0, t2);
    })

    it('should move the thing based on the target and the velocity - x axis positive',function() {
        var t1 = new Date(2000,1,1,10,9,0,0);
        var t2 = new Date(2000,1,1,10,9,1,0);
        
        var thing = new things.Thing(t1);
        things.set_thing_target_position_and_velocity(thing,10,0,1,t1)
        things.update_thing(thing,t2);
        assert_thing_values(thing,null, 1,0, 10,0, 1, t2);
    })

    it('should move the thing based on the target and the velocity - x axis negative',function() {
        var t1 = new Date(2000,1,1,10,9,0,0);
        var t2 = new Date(2000,1,1,10,9,1,0);
        
        var thing = new things.Thing(t1);
        things.set_thing_target_position_and_velocity(thing,-10,0,1,t1)
        things.update_thing(thing,t2);
        assert_thing_values(thing,null, -1,0, -10,0, 1, t2);
    })

    it('should move the thing based on the target and the velocity - y axis positive',function() {
        var t1 = new Date(2000,1,1,10,9,0,0);
        var t2 = new Date(2000,1,1,10,9,1,0);
        
        var thing = new things.Thing(t1);
        things.set_thing_target_position_and_velocity(thing,0,10,1,t1)
        things.update_thing(thing,t2);
        assert_thing_values(thing,null, 0,1, 0,10, 1, t2);
    })

    it('should move the thing based on the target and the velocity - y axis negative',function() {
        var t1 = new Date(2000,1,1,10,9,0,0);
        var t2 = new Date(2000,1,1,10,9,1,0);
        
        var thing = new things.Thing(t1);
        things.set_thing_target_position_and_velocity(thing,0,-10,1,t1)
        things.update_thing(thing,t2);
        assert_thing_values(thing,null, 0,-1, 0,-10, 1, t2);
    })

    it('should move the thing based on the target and the velocity - x and y axis positive',function() {
        var t1 = new Date(2000,1,1,10,9,0,0);
        var t2 = new Date(2000,1,1,10,9,1,0);
        
        var thing = new things.Thing(t1);
        things.set_thing_target_position_and_velocity(thing,10,10,1,t1)
        things.update_thing(thing,t2);
        
        var d = vector.distance(0,0,10,10);
        assert_thing_values(thing,null, d,d   , 10,10, 1, t2);
    })
})
*/