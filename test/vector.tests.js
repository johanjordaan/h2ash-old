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
            var v = new Vector2D(10,10,18,18);
            assert_vactor_values(v, 10,10, 18,18, 8,8, Math.sqrt(8*8 + 8*8) );
        });
		it('should create a new vector with all values set to the default', function() {
            var v = new Vector2D();
            assert_vactor_values(v, 0,0, 0,0, 0,0, Math.sqrt(0*0 + 0*0) );
        });
    });
    
    describe('#set', function() {
        it('should set the values of of both points', function() {
            var v = new Vector2D(2,2,10,10);
            assert_vactor_values(v, 2,2, 10,10, 8,8, Math.sqrt(8*8 + 8*8) );
        })
    })
    describe('#set_p1', function() {
        it('should set the values point 1 (via vector)', function() {
            var v = new Vector2D(0,0,0,0);
			v.set_p1(2,2);
            assert_vactor_values(v, 2,2, 0,0, -2,-2, Math.sqrt(2*2 + 2*2) );
        })
        it('should set the values point 1 (via point)', function() {
            var v = new Vector2D(0,0,0,0);
			v.p1.set(2,2);
            assert_vactor_values(v, 2,2, 0,0, -2,-2, Math.sqrt(2*2 + 2*2) );
        })

    })
    describe('#set_p2', function() {
        it('should set the values point 2 (via vector)', function() {
            var v = new Vector2D(0,0,0,0);
			v.set_p2(8,8);
            assert_vactor_values(v, 0,0, 8,8, 8,8, Math.sqrt(8*8 + 8*8) );
        })
        it('should set the values point 2 (via point)', function() {
            var v = new Vector2D(0,0,0,0);
			v.p2.set(8,8);
            assert_vactor_values(v, 0,0, 8,8, 8,8, Math.sqrt(8*8 + 8*8) );
        })
    })
    describe('#translate', function() {
        it('should translate both point of the vector by the specified values', function() {
            var v = new Vector2D(0,0,10,10);
            v.translate(10,10)
            assert_vactor_values(v, 10,10, 20,20, 10,10, Math.sqrt(10*10 + 10*10) );
        })
    })
    describe('#translate_p1', function() {
        it('should translate point 1 of the vector by the specified values (via vector))', function() {
            var v = new Vector2D(0,0,10,10);
            v.translate_p1(5,5)
            assert_vactor_values(v, 5,5, 10,10, 5,5, Math.sqrt(5*5 + 5*5) );
        })
        it('should translate point 1 of the vector by the specified values (via point)', function() {
            var v = new Vector2D(0,0,10,10);
            v.p1.translate(5,5)
            assert_vactor_values(v, 5,5, 10,10, 5,5, Math.sqrt(5*5 + 5*5) );
        })

    })
    describe('#translate_p2', function() {
        it('should translate point 2 of the vector by the specified values (via vector)', function() {
            var v = new Vector2D(0,0,10,10);
            v.translate_p2(5,5)
            assert_vactor_values(v, 0,0, 15,15, 15,15, Math.sqrt(15*15 + 15*15) );
        })
        it('should translate point 2 of the vector by the specified values (via point)', function() {
            var v = new Vector2D(0,0,10,10);
            v.p2.translate(5,5)
            assert_vactor_values(v, 0,0, 15,15, 15,15, Math.sqrt(15*15 + 15*15) );
        })

    })
})
