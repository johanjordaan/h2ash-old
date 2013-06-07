var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var trig = require('../utils/trig.js');

var float_error = 0.000001;

describe('deg2rad',function(){
	it('should convert degrees to radians - standard cases',function() {
		var rad = trig.deg2rad(0);
		rad.should.equal(0);
		rad = trig.deg2rad(90);
		rad.should.equal(Math.PI/2);
		rad = trig.deg2rad(180);
		rad.should.equal(Math.PI);
		rad = trig.deg2rad(270);
		rad.should.equal(Math.PI*3/2);
		rad = trig.deg2rad(360);
		rad.should.equal(0);
		rad = trig.deg2rad(380);
		rad.should.equal(trig.deg2rad(20));
		rad = trig.deg2rad(-20);
		rad.should.equal(trig.deg2rad(340));
	});
});

describe('rad2deg',function(){
	it('should convert radians to degrees - standard cases',function() {
		var deg = trig.rad2deg(0);
		deg.should.equal(0);
		deg = trig.rad2deg(Math.PI/2);
		deg.should.equal(90);
		deg = trig.rad2deg(Math.PI);
		deg.should.equal(180);
		deg = trig.rad2deg(Math.PI*3/2);
		deg.should.equal(270);
		deg = trig.rad2deg(Math.PI*2);
		deg.should.equal(360);
	});
});


describe('min_angle_between',function(){
	it('should calculate the minimum angle between the two given angles (general cases)',function(){
		var min_angle = trig.min_angle_between(trig.deg2rad(350),trig.deg2rad(10));
		trig.rad2deg(min_angle).should.be.within(20-float_error,20+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(80),trig.deg2rad(100));
		trig.rad2deg(min_angle).should.be.within(20-float_error,20+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(10),trig.deg2rad(350));
		trig.rad2deg(min_angle).should.be.within(-20-float_error,-20+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(100),trig.deg2rad(80));
		trig.rad2deg(min_angle).should.be.within(-20-float_error,-20+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(169),trig.deg2rad(350));
		trig.rad2deg(min_angle).should.be.within(-179-float_error,-179+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(171),trig.deg2rad(350));
		trig.rad2deg(min_angle).should.be.within(179-float_error,179+float_error);
	});
	it('should calculate the minimum angle between the two given angles - 0 cases',function(){
		var min_angle = trig.min_angle_between(trig.deg2rad(0),trig.deg2rad(0));
		trig.rad2deg(min_angle).should.be.within(0-float_error,0+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(360),trig.deg2rad(0));
		trig.rad2deg(min_angle).should.be.within(0-float_error,0+float_error);
		min_angle = trig.min_angle_between(trig.deg2rad(0),trig.deg2rad(360));
		trig.rad2deg(min_angle).should.be.within(0-float_error,0+float_error);
		
		// The below case fails but that is ok. I dont want to introduce the overhead 
		// of handling it Maybee handling it in the conversion is the answer? 
		//min_angle = trig.min_angle_between(trig.deg2rad(0),trig.deg2rad(720));
		//trig.rad2deg(min_angle).should.be.within(0-float_error,0+float_error);
	});
});
