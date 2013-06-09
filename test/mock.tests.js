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
		it('should convert an object to a mock',function() {
			var source = {f1:function(){ this.val = 1; }, f2:function() { this.val =2;} }
			var mock = new Mock(source);
			mock.should.equal(source);
			mock.expect.should.be.a('function');
			mock.validate.should.be.a('function');
		});
	});
	
	describe('#expect/#validate',function(){
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
		});
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
		it('should create an expectation for a method on a eixting object',function(){
			var source = {f1:function(){ this.val = 1; }, f2:function() { this.val =2;} }
			var mock = new Mock(source);
			
			mock.expect('f1',[],function(mock) { mock.val=10;});	
			mock.expect('f2',[],function(mock) { mock.val=20;});	
						
			mock.f1();
			
			mock.methods['f1'].call_count.should.equal(1);
			mock.val.should.equal(10);
			
			var v = mock.validate();
			v.status.should.equal('error');
			v.messages.length.should.equal(2);
		})
		it('should create an expectation on the same function with different values',function() {
			var source = {f1:function(a){ this.val = a; } , f2:function(a) { this.val = a; this.f1(a); }}
			var mock = new Mock(source);
			
			mock.expect('f1',[1],function(m){ m.val.should.equal(1);});
			mock.expect('f1',[2],function(m){ m.val.should.equal(2);});
			
			source.f2(1);
			source.f2(2);
			
			var v = mock.validate(true);
			v.status.should.equal('ok');
			v.messages.length.should.equal(0);
			
		});

	});
	
});
