var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var printf = require('../utils/printf.js').printf

describe('Mock',function() {
	describe('#constructor',function(){
		it('should create a new clean mock object',function() {
			var mock = new Mock();
			_.keys(mock.methods).should.have.length(0);
		});
		it('should create a new clean mock object with default methods',function() {
			var mock = new Mock(['func_a','func_b']);
			_.keys(mock.methods).should.have.length(2);
			_.has(mock.methods,'func_a').should.equal(true);
			_.has(mock.methods,'func_b').should.equal(true);
			mock.methods['func_a'].call_count.should.equal(0);
			mock.methods['func_b'].call_count.should.equal(0);
		});
	});
	
	describe('#expect',function(){
		it('should create an expectation for a method and allow the method to be called',function(){
			var mock = new Mock(['func_a']);
			
			mock.expect('func_a',['a','b'],function() {});	

			_.keys(mock.methods).length.should.equal(1);
			mock.methods['func_a'].should.be.a('Object');
			mock.expected_calls.length.should.equal(1);
			mock.actual_calls.length.should.equal(0);
			
			mock.func_a('a','b');
			
			mock.actual_calls.length.should.equal(1);
			mock.methods['func_a'].call_count.should.equal(1);
		})
	});
	
	describe('#validate',function(){
		it('should create an expectation for a method',function(){
			var mock = new Mock(['func_a','func_b']);
			
			mock.expect('func_a',['a','b'],function() {});	
			mock.expect('func_b',['a','a'],function() {});	
						
			mock.func_a('a','b');
			mock.func_b('a','b');
			
			mock.methods['func_a'].call_count.should.equal(1);
			mock.methods['func_b'].call_count.should.equal(1);
			
			var v = mock.validate();
			v.status.should.equal('error');
			v.messages.length.should.equal(1);
			//console.log(v.messages);
		})
	});
	
});
