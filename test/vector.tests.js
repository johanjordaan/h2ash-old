var assert = require('assert')

var Point2D = require('../utils/point.js').Point2D;
var Vector2D = require('../utils/vector.js').Vector2D;


var assert_vactor_values = function(vector,x1,y1,x2,y2,dx,dy,length) {
    assert.equal(vector.p1.x,x1);
    assert.equal(vector.p1.y,y1);
    assert.equal(vector.p2.x,x2);
    assert.equal(vector.p2.y,y2);
    assert.equal(vector.dx,dx);
    assert.equal(vector.dy,dy);
    assert.equal(vector.length,length);

}

describe('Vector2D', function() {
    describe('#constructor', function() {
        it('should create a new vector with all values set to the specified values', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            assert_vactor_values(v, 0,0, 10,10, 10,10, Math.sqrt(10*10 + 10*10) );
        })
    })
    
    describe('#set', function() {
        it('should set the values of of both points', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            v.set(new Point2D(2,2),new Point2D(10,10))
            assert_vactor_values(v, 2,2, 10,10, 8,8, Math.sqrt(8*8 + 8*8) );
        })
    })
    describe('#set_p1', function() {
        it('should set the values point 1', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            v.set_p1(new Point2D(2,2))
            assert_vactor_values(v, 2,2, 10,10, 8,8, Math.sqrt(8*8 + 8*8) );
        })
    })
    describe('#set_p2', function() {
        it('should set the values point 2', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            v.set_p2(new Point2D(8,8))
            assert_vactor_values(v, 0,0, 8,8, 8,8, Math.sqrt(8*8 + 8*8) );
        })
    })
    describe('#translate', function() {
        it('should translate both point of the vector by the specified values', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            v.translate(10,10)
            assert_vactor_values(v, 10,10, 20,20, 10,10, Math.sqrt(10*10 + 10*10) );
        })
    })
    describe('#translate_p1', function() {
        it('should translate point 1 of the vector by the specified values', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            v.translate_p1(5,5)
            assert_vactor_values(v, 5,5, 10,10, 5,5, Math.sqrt(5*5 + 5*5) );
        })
    })
    describe('#translate_p2', function() {
        it('should translate point 2 of the vector by the specified values', function() {
            var v = new Vector2D(new Point2D(0,0),new Point2D(10,10));
            v.translate_p2(5,5)
            assert_vactor_values(v, 0,0, 15,15, 15,15, Math.sqrt(15*15 + 15*15) );
        })
    })
})
