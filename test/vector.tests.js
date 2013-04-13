var assert = require('assert')

var vector = require('../utils/vector.js')

describe('Vector2D', function() {
    describe('#constructor', function() {
        it('should create a new vector with all values set to the specified values', function() {
            var v = new vector.Vector2D(0,0,10,10);
            assert.equal(v.x1,0);
            assert.equal(v.y1,0);
            assert.equal(v.x2,10);
            assert.equal(v.y2,10);
        })
    })
})
