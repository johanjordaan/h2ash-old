var assert = require('assert')

var point = require('../utils/point.js')

var assert_point_values = function(point,x,y) {
    assert.equal(point.x,x);
    assert.equal(point.y,y);
}


describe('Point2D', function() {
    describe('#constructor', function() {
        it('should create a new point with all values set to the specified values', function() {
            var p = new point.Point2D(10,10);
            assert_point_values(p, 10, 10 );
        })
    })
    describe('#set', function() {
        it('should set the points coordinates to the new values', function() {
            var p = new point.Point2D(10,10);
            p.set(20,20);
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

})
