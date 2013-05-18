var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var movement = require('../utils/movement.js');

describe('Point2D', function() {
	describe('update_movable_object',function() {
		it('should move an object by the correct amount',function(){
			var obj = { px:0,py:0,dx:100,dy:0,v:1,last_update:0 }
			movement.update_movable_object(obj,1000);
			obj.px.should.equal(1);
		});

		it('should move an object by the same amount in the same time independently of number of calls',function(){
			var obj1 = { px:0,py:0,dx:100,dy:0,v:1,last_update:0 }
			var obj2 = { px:0,py:0,dx:100,dy:0,v:1,last_update:0 }
			
			movement.update_movable_object(obj1,1000*10);
			
			for(var i=1;i<11;i++) {
				movement.update_movable_object(obj2,1000*i);
			}	
				
			obj1.px.should.equal(10);
			obj2.px.should.equal(10);
			
		});
	});

})
