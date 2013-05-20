var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var object = require('../utils/object.js');

var float_error = 0.000001;


describe('create',function() {
	it('should create a valid new object',function(){
		var obj = object.create(10,20,0);
		obj.p_x.should.equal(10);
		obj.p_y.should.equal(20);
		obj.v.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.av.should.equal(0);
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(0);
	});
});	
	
describe('update',function(){
	it('should not update anything on a _new_ object',function(){
		var obj = object.create(0,0,0);
		object.update(obj,1000);
		obj.p_x.should.equal(0);
		obj.p_y.should.equal(0);
		obj.heading.should.equal(Math.PI/2);
		obj.t_r.should.equal(0);
		obj.t_theta.should.equal(Math.PI/2);
		obj.last_update.should.equal(1000);
		
	});
});	
	
	
	
	/*it('should rotate the object by the correct amount and in the right direction (located at zero)',function(){
		var obj = { px:0,py:0,tx:100,ty:0,v:0,heading:0,av:1,last_update:0 }
		movement.update(obj,1000);
		obj.heading.should.equal(1);
		movement.update(obj,1000);
		obj.heading.should.equal(2);
		obj.tx = -100;
		movement.update(obj,1000);
		obj.heading.should.equal(1);
		movement.update(obj,2000);
		obj.heading.should.equal(359);
		obj.tx = 100;
		movement.update(obj,1000);
		obj.heading.should.equal(0);
	});
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
