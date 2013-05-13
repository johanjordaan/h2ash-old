var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;


var Point2D = require('../utils/point.js').Point2D

var assert_point_values = function(point,x,y) {
    assert.equal(point.x,x);
    assert.equal(point.y,y);
}

describe('Point2D', function() {
    describe('#constructor', function() {
        it('should create a new point with default values', function() {
            var p = new Point2D();
			assert_point_values(p, 0, 0 );
        })
		it('should create a new point with specified values', function() {
            var p = new Point2D({x:10,y:10});
			assert_point_values(p, 10, 10 );
			var p2 = new Point2D({x:10});
			assert_point_values(p2, 10, 0 );
			var p3 = new Point2D({y:10});
			assert_point_values(p3, 0, 10 );
        })
        it('should create a new point with the same values as the source point', function() {
            var p = new Point2D({x:20,y:30});
			assert_point_values(p, 20, 30 );
			var p2 = new Point2D({source:p});
			assert_point_values(p2, 20, 30 );
        })

    })
    describe('#set', function() {
        it('should set the points values to the specified values', function() {
            var p = new Point2D();
            p.set({x:20,y:20});
            assert_point_values(p, 20, 20 );
			p.set({y:10});
            assert_point_values(p, 20, 10 );
			p.set({x:10});
            assert_point_values(p, 10, 10 );
        })
        it('should set the points values to the same values as the supplied point', function() {
            var p = new Point2D();
            p.set({x:20,y:20});
			var p2 = new Point2D();
			p2.set({source:p});
            assert_point_values(p2, 20, 20 );
		});
	});

    describe('#set_c', function() {
        it('should set the points values to the specified values (component values)', function() {
            var p = new Point2D();
            p.set_c(20,20);
            assert_point_values(p, 20, 20 );
        })
	});

    describe('#translate', function() {
        it('should translate the points coordinates by the given delta values', function() {
            var p = new Point2D({x:10,y:10});
            p.translate(-20,20);
            assert_point_values(p, -10, 30 );
        })
    })
	describe('#bind and handlers', function() {
        it('should invoke the on_change handlers when the set method is called', function() {
			var p = new Point2D({x:10,y:10});
			var test_str = 'no_changed';
			p.bind('on_change',function() {
				test_str = 'changed';
			});
			p.set({x:20,y:20});
			test_str.should.equal('changed');
        });
        it('should invoke the on_change handlers when the translate method is called', function() {
			var p = new Point2D({x:10,y:10});
			var test_str = 'no_changed';
			p.bind('on_change',function() {
				test_str = 'changed';
			});
			p.translate(20,20);
			test_str.should.equal('changed');
        });

    })

})
