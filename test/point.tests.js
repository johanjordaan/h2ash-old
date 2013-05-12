var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;


var point = require('../utils/point.js')

var assert_point_values = function(point,x,y) {
    assert.equal(point.x,x);
    assert.equal(point.y,y);
}

describe('Point2D', function() {
    describe('#constructor', function() {
        it('should create a new point with no values assigned', function() {
            var p = new point.Point2D();
            assert.equal(typeof(p.x),'undefined');
			assert.equal(typeof(p.y),'undefined');
        })
		it('should create a new point with the value specified (cloned from a previous point)', function() {
            var p = new point.Point2D();
            p.set_c(10,10);
			var p2 = new point.Point2D(p);
			assert_point_values(p2, 10, 10 );
        })
		it('should create a new point with the value specified (cloned from a previous point)', function() {
            var p = new point.Point2D();
            p.set_c(10,10);
			assert_point_values(p, 10, 10 );
        })

    })
    describe('#set_c', function() {
        it('should set the component values of the point', function() {
            var p = new point.Point2D();
            p.set_c(20,20);
            assert_point_values(p, 20, 20 );
        })
    })
    describe('#set', function() {
        it('should set point to have the same values as the source point', function() {
            var p = new point.Point2D();
            p.set_c(20,20);
			var p2 = new point.Point2D();
			p2.set(p);
            assert_point_values(p, 20, 20 );
        })
    })

    describe('#translate', function() {
        it('should translate the points coordinates by the given delta values', function() {
            var p = new point.Point2D(10,10);
            p.translate(-20,20);
            assert_point_values(p, -10, 30 );
        })
    })
	describe('#bind and handlers', function() {
        it('should invoke the on_change handlers when the set method is called', function() {
			var p = new point.Point2D(10,10);
			var test_str = 'no_changed';
			p.bind('on_change',function() {
				test_str = 'changed';
			});
			p.set(20,20);
			test_str.should.equal('changed');
        });
        it('should invoke the on_change handlers when the translate method is called', function() {
			var p = new point.Point2D(10,10);
			var test_str = 'no_changed';
			p.bind('on_change',function() {
				test_str = 'changed';
			});
			p.translate(20,20);
			test_str.should.equal('changed');
        });

    })

})
