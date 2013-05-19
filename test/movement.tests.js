var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var movement = require('../utils/movement.js');

describe('Point2D', function() {
	describe('calculate_angle_to_target',function() { 
		it('should calculate angle to a vector from the y axis closkwise (45 degrees)',function(){
			var angle = movement.calculate_angle_to_target(10,10);
			angle.should.equal(45);
			angle = movement.calculate_angle_to_target(10,-10);
			angle.should.equal(135);
			angle = movement.calculate_angle_to_target(-10,-10);
			angle.should.equal(225);
			angle = movement.calculate_angle_to_target(-10,10);
			angle.should.equal(315);
		});
		
		it('should calculate angle to a vector from the y axis closkwise (90 degrees)',function(){
			var angle = movement.calculate_angle_to_target(0,10);
			angle.should.equal(0);
			angle = movement.calculate_angle_to_target(10,0);
			angle.should.equal(90);
			angle = movement.calculate_angle_to_target(0,-10);
			angle.should.equal(180);
			angle = movement.calculate_angle_to_target(-10,0);
			angle.should.equal(270);
		});

		it('should calculate angle to a vector from the y axis closkwise (less than 45)',function(){
			var angle = movement.calculate_angle_to_target(5,10);
			angle.should.equal(26.56505117707799);
			angle = movement.calculate_angle_to_target(5,-10);
			angle.should.equal(153.43494882292202);
			angle = movement.calculate_angle_to_target(-5,-10);
			angle.should.equal(206.56505117707798);
			angle = movement.calculate_angle_to_target(-5,10);
			angle.should.equal(333.434948822922);
		});

		it('should calculate angle to a vector from the y axis closkwise (more than 45)',function(){
			var angle = movement.calculate_angle_to_target(10,5);
			angle.should.equal(63.43494882292201);
			angle = movement.calculate_angle_to_target(10,-5);
			angle.should.equal(116.56505117707799);
			angle = movement.calculate_angle_to_target(-10,-5);
			angle.should.equal(243.43494882292202);
			angle = movement.calculate_angle_to_target(-10,5);
			angle.should.equal(296.565051177078);
		});
		
	});


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
		
		/*it('should rotate an object by the correct amount',function(){
			var obj = { px:0,py:0,dx:0,dy:0,v:0,last_update:0 }
			movement.update_movable_object(obj,1000);
			obj.px.should.equal(1);
		});*/

	});

})
