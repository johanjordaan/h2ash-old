var assert = require('assert')
var should = require('chai').should();

var construct = require('../utils/constructor.js').construct
var printf = require('../utils/printf.js').printf

var X = function(a,b) {
	this.set(a,b);
}
X.prototype.set = function(a,b) {
	this.a = a;
	this.b = b;
}


describe('construct', function() {
	it('should create an instance of the specified class with the given arguments', function() {
		var x = construct(X).using.parameters(1,2);
		x.a.should.equal(1);
		x.b.should.equal(2);
	})
	it('should create an instance of the specified class with the given arguments as an array', function() {
		var x = construct(X).using.array([33,9]);
		x.a.should.equal(33);
		x.b.should.equal(9);
	})

})
