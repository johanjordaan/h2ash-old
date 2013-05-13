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
		it('should create a new vector with all values set to the default', function() {
            var v = new Vector2D();
			assert.equal(typeof(v.p1),'undefined');
			assert.equal(typeof(v.p2),'undefined');
			assert.equal(typeof(v.dx),'undefined');
			assert.equal(typeof(v.dy),'undefined');
			assert.equal(typeof(v.length),'undefined');
        });
        it('should create a new vector and use the component values to set the points', function() {
            var v = new Vector2D({x1:10,y1:10,x2:18,y2:18});
            assert_vactor_values(v, 10,10, 18,18, 8,8, Math.sqrt(8*8 + 8*8) );
        });
        it('should create a new vector and use points to set the values of the points points (do not set the vector poiunts to ref the setting points) ', function() {
            var p1 = new Point2D(10,10)
			var p2 = new Point2D(18,18)
			var v = new Vector2D({p1:p1,p2:p2});
			p1.set(0,0);
			p2.set(0,0);
            assert_vactor_values(v, 10,10, 18,18, 8,8, Math.sqrt(8*8 + 8*8) );
        });
        it('should create a new vector and use ref the points specified', function() {
            var p1 = new Point2D(10,10)
			var p2 = new Point2D(18,18)
			var v = new Vector2D({p1:p1,p2:p2,p1_ref:true,p2_ref:true});
			p1.set_c(0,0);
			p2.set_c(10,10);
            assert_vactor_values(v, 0,0, 10,10, 10,10, Math.sqrt(10*10 + 10*10) );
        });
    });
    describe('#set_c', function() {
        it('should set the values of of both points', function() {
            var v = new Vector2D(0,0,0,0);
			v.set_c(2,2,10,10);
            assert_vactor_values(v, 2,2, 10,10, 8,8, Math.sqrt(8*8 + 8*8) );
        })
    })
    describe('#p1.set_c', function() {
        it('should set the values of of both points', function() {
            var v = new Vector2D(0,0,0,0);
			v.p1.set_c(3,3);
            assert_vactor_values(v, 3,3, 0,0, -3,-3, Math.sqrt(3*3 + 3*3) );

        })
    })
    describe('#p2.set_c', function() {
        it('should set the values of of both points', function() {
            var v = new Vector2D(0,0,0,0);
			v.p2.set_c(3,3);
            assert_vactor_values(v, 0,0, 3,3, 3,3, Math.sqrt(3*3 + 3*3) );
        })
    })

    describe('#set', function() {
        it('should set the values of of both points using the source pointss data (dont ref the source points)', function() {
            var v = new Vector2D();
			var p1 = new Point2D(2,2);
			var p2 = new Point2D(10,10);
			v.set({p1:p1,p2:p2});
			p1.set_c(0,0);
			p2.set_c(0,0);
            assert_vactor_values(v, 2,2, 10,10, 8,8, Math.sqrt(8*8 + 8*8) );
        });
        it('should set the vector points to the source points (ref the source points)', function() {
            var v = new Vector2D();
			var p1 = new Point2D(2,2);
			var p2 = new Point2D(10,10);
			v.set({p1:p1,p2:p2,p1_ref:true,p2_ref:true});
			p1.set_c(8,8);
			p2.set_c(0,0);
            assert_vactor_values(v, 8,8, 0,0, -8,-8, Math.sqrt(8*8 + 8*8) );
        });
        it('should set the vector p1 to the source point (ref the source point)', function() {
            var v = new Vector2D(0,0,0,0);
			var p1 = new Point2D(2,2);
			v.set({p1:p1,p1_ref:true});
			p1.set_c(8,8);
            assert_vactor_values(v, 8,8, 0,0, -8,-8, Math.sqrt(8*8 + 8*8) );
        });
        it('should set the vector p2 to the source point (ref the source point)', function() {
            var v = new Vector2D(0,0,0,0);
			var p2 = new Point2D(2,2);
			v.set({p2:p2,p2_ref:true});
			p2.set_c(9,2);
            assert_vactor_values(v, 0,0, 9,2, 9,2, Math.sqrt(9*9 + 2*2) );
        });
    })
	
    describe('#translate', function() {
        it('should translate both point of the vector by the specified values', function() {
            var v = new Vector2D(0,0,10,10);
            v.translate(10,10)
            assert_vactor_values(v, 10,10, 20,20, 10,10, Math.sqrt(10*10 + 10*10) );
        })
    })
    describe('#p1.translate', function() {
        it('should translate point 1 of the vector by the specified values (via vector and point)', function() {
            var v = new Vector2D(0,0,20,20);
            v.p1.translate(10,10)
            assert_vactor_values(v, 10,10, 20,20, 10,10, Math.sqrt(10*10 + 10*10) );
        })

    })
    describe('#p2.translate', function() {
        it('should translate point 2 of the vector by the specified values (via vector and point)', function() {
            var v = new Vector2D(0,0,10,10);
            v.p2.translate(10,-5)
            assert_vactor_values(v, 0,0, 20,5, 20,5, Math.sqrt(20*20 + 5*5) );
        })
    })
})
