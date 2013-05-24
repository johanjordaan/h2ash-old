var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var trug = require('../utils/trig.js');
var object = require('../utils/object.js');

var float_error = 0.000001;

describe('create',function() {
	it('should create a valid new object',function(){
		var obj = object.create(10,20,0);
		obj.p_x.should.equal(10);
		obj.p_y.should.equal(20);
		obj.t_x.should.equal(10);
		obj.t_y.should.equal(20);
		obj.v.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.av.should.equal(0);
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(0);
	});
});	


describe('set_target',function() {
	it('should set the target r and theta based on the xy coordinates',function(){
		var obj = object.create(10,10,0);
		object.set_target(obj,100,100,0);
		obj.p_x.should.equal(10);
		obj.p_y.should.equal(10);
		obj.t_x.should.equal(100);
		obj.t_y.should.equal(100);
		obj.v.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.av.should.equal(0);
		obj.t_r.should.equal(Math.sqrt(90*90+90*90));
		obj.t_theta.should.equal(Math.PI/4);
		obj.last_update.should.equal(0);
	});
});

describe('set_velocity',function() {
	it('should set the velocity of the object',function(){
		var obj = object.create(10,10,0);
		object.set_velocity(obj,50,0);
		obj.p_x.should.equal(10);
		obj.p_y.should.equal(10);
		obj.t_x.should.equal(10);
		obj.t_y.should.equal(10);
		obj.v.should.equal(50);
		obj.heading.should.equal(Math.PI/2);
		obj.av.should.equal(0);
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(0);
	});
});

describe('set_angular_velocity',function() {
	it('should set the angular velocity of the object',function(){
		var obj = object.create(10,10,0);
		object.set_angular_velocity(obj,30,0);
		obj.p_x.should.equal(10);
		obj.p_y.should.equal(10);
		obj.t_x.should.equal(10);
		obj.t_y.should.equal(10);
		obj.v.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.av.should.equal(trig.deg2rad(30));
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(0);
	});
});

describe('update',function(){
	it('should not update anything (except for timestamp) on a _new_ object',function(){
		var obj = object.create(0,0,0);
		object.update(obj,1000);
		obj.p_x.should.equal(0);
		obj.p_y.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(1000);
	});
	it('should not update anything if no time elapsed',function(){
		var obj = object.create(0,0,0);
		object.update(obj,0);
		obj.p_x.should.equal(0);
		obj.p_y.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(0);
	});
	
	it('should rotate the object by the correct amount and in the right direction (located at zero)',function(){
		var obj = object.create(0,0,0);
		object.set_target(obj,100,0,0);
		object.set_angular_velocity(obj,1,0);

		// Clockwise
		object.update(obj,1000);
		obj.heading.should.equal(trig.deg2rad(89));
		object.update(obj,2000);
		obj.heading.should.equal(trig.deg2rad(88));
		
		// Anticlockwise
		object.set_target(obj,-100,0,2000);
		object.update(obj,3000);
		obj.heading.should.equal(trig.deg2rad(89));
		object.update(obj,5000);	// 2seconds
		obj.heading.should.equal(trig.deg2rad(91));
	});
	
	it('should rotate the object by the correct amount and in the right direction (actual screen simulation)',function(){
		var obj = object.create(100,-100,0);
		object.set_target(obj,200,-200,0);
		object.set_angular_velocity(obj,1,0);

		// Clockwise
		object.update(obj,1000);
		obj.heading.should.equal(trig.deg2rad(89));
		object.update(obj,2000);
		obj.heading.should.equal(trig.deg2rad(88));
		object.update(obj,1000*1000);
		obj.heading.should.equal(trig.deg2rad(360-45));
		
		// Anticlockwise
		object.set_target(obj,200,0,1000*1000);
		object.update(obj,1000*1001);
		obj.heading.should.equal(trig.deg2rad(360-44));
		object.update(obj,1000*2000);
		obj.heading.should.equal(trig.deg2rad(45));
	});

	it('should set the heading to the target if the diff between the two is very small',function(){
		var obj = object.create(100,-100,0);
		object.set_target(obj,100.000001,0,0);
		object.set_angular_velocity(obj,1,0);

		// Clockwise
		object.update(obj,1000);
		obj.heading.should.equal(obj.t_theta);
		object.update(obj,3000);
		obj.heading.should.equal(obj.t_theta);
		
		// Anticlockwise
		object.set_target(obj,100,0,3000);
		object.update(obj,4000);
		obj.heading.should.equal(obj.t_theta);
	});

	
	
	
});	
	
	
	
	/*
});*/
/*	it('should default to the target direction if the amount of time is large (located at zero))',function(){
		var obj = { px:0,py:0,tx:100,ty:0,v:0,heading:0,av:1,last_update:0 }
		movement.update(obj,91*1000);
		obj.heading.should.equal(90);
		var obj = { px:0,py:0,tx:-100,ty:0,v:0,heading:0,av:1,last_update:0 }
		movement.update(obj,275*1000);
		obj.heading.should.equal(270);
	});
	it('should rotate the object by the correct amount and in the right direction (located at an offset)',function(){
		var obj = { px:100,py:100,tx:200,ty:100,v:0,heading:0,av:1,last_update:0 }
		movement.update(obj,1000);
		obj.heading.should.equal(1);
		movement.update(obj,1000);
		obj.heading.should.equal(2);
		obj.tx = -200;
		movement.update(obj,1000);
		obj.heading.should.equal(1);
		movement.update(obj,2000);
		obj.heading.should.equal(359);
		obj.tx = 200;
		movement.update(obj,1000);
		obj.heading.should.equal(0);
	});
	it('should default to the target direction if the amount of time is large (located at an offset))',function(){
		var obj = { px:100,py:100,tx:200,ty:100,v:0,heading:0,av:1,last_update:0 }
		movement.update(obj,91*1000);
		obj.heading.should.equal(90);
		var obj = { px:100,py:100,tx:0,ty:100,v:0,heading:0,av:1,last_update:0 }
		movement.update(obj,275*1000);
		obj.heading.should.equal(270);
	});
	

	it('should move the heading until it matches target dirction',function(){
		var obj = { px:100,py:100,tx:200,ty:100,v:0,heading:0,av:1,last_update:0 }
		for(var i=1;i<=90;i++) {
			movement.update(obj,i*(1000));
			obj.heading.should.equal(i);
		}
		
	});
*/	
	
		//+Math.floor((Math.random()*10)+1)) Random between 1 and 10 
	//it('should move an object by the same amount in the same time independently of number of calls',function(){
	/*	var obj1 = { px:0,py:0,dx:100,dy:0,v:1,last_update:0 }
		var obj2 = { px:0,py:0,dx:100,dy:0,v:1,last_update:0 }
		
		movement.update(obj1,1000*10);
		
		for(var i=1;i<11;i++) {
			movement.update(obj2,1000*i);
		}	
			
		obj1.px.should.equal(10);
		obj2.px.should.equal(10);*/
	//});
	
	//it('should rotate an object by the correct amount',function(){
		//var obj = { px:0,py:0,dx:0,dy:0,v:0,last_update:0 }
		//movement.update(obj,1000);
		//obj.px.should.equal(1);
	//});

//});
