var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var _ = require('underscore');

var Junction = require('../utils/junction.js').Junction
var printf = require('../utils/printf.js').printf



describe('Junction', function() {
	describe('#constructor',function(){
		it('should create an instance of a junction with correctly initialised values', function() {
			var j = new Junction();
			j.count.should.equal(0);
			_.isUndefined(j.f).should.equal(true);
		})
	});
	describe('#call/#finsalise',function(){
		it('should call the function with the relevant parameters',function() {
			
			var total = 0;
			var add = function(a,b,ms,callback) {
				setTimeout(function() {
					total = total+a+b;
					callback(a+b);
				},ms);
			};
			
			var normal_add = function(a,b) {
				return a+b;
			}
			
			var j = new Junction();
			j.call(add,1,2,100,function(cb_value) {
				j.count.should.equal(2);
				total.should.equal(3);
				cb_value.should.equal(3);
				return cb_value;
			});
			
			j.call(add,4,8,200,function(cb_value) {
				j.count.should.equal(1);
				sum.should.equal(15);
				cb_value.should.equal(12);
				return cb_value;
			});
			
			j.call(normal_add,10,10);
			
			j.finalise(function (ret_vals) { 
				j.count.should.equal(0);
				ret_vals.should.be.a('Array');
				ret_vals.length.should.equal(3);
				ret_vals[0].should.equal(20);
				ret_vals[1].should.equal(3);
				ret_vals[2].should.equal(12);
			});
			
		})
		
	});
})
