var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var Camera = require('../utils/camera.js').Camera;

describe('Camera',function(){
	it('#Constructor',function() {
		var camera = new Camera(0,0,4000,4000/3000);
		camera.center_x.should.equal(0);
		camera.center_y.should.equal(0);
		camera.width.should.equal(4000);
		camera.height.should.equal(3000);
		camera.left_top_x.should.equal(-2000);
		camera.left_top_y.should.equal(-1500);
	});
	it('#Translate',function() { 
		var camera = new Camera(0,0,4000,4000/3000);
		camera.translate(-10,-10);
		camera.center_x.should.equal(-10);
		camera.center_y.should.equal(-10);
		camera.width.should.equal(4000);
		camera.height.should.equal(3000);
		camera.left_top_x.should.equal(-2000-10);
		camera.left_top_y.should.equal(-1500-10);
		
		camera.translate(0,20);
		camera.center_x.should.equal(-10);
		camera.center_y.should.equal(10);
		camera.width.should.equal(4000);
		camera.height.should.equal(3000);
		camera.left_top_x.should.equal(-2000-10);
		camera.left_top_y.should.equal(-1500+10);

		camera.translate(-20,0);
		camera.center_x.should.equal(-30);
		camera.center_y.should.equal(10);
		camera.width.should.equal(4000);
		camera.height.should.equal(3000);
		camera.left_top_x.should.equal(-2000-30);
		camera.left_top_y.should.equal(-1500+10);
	});
	it('#Scale',function() { 
		var camera = new Camera(0,0,4000,4000/3000);
		camera.scale(2);
		camera.left_top_x.should.equal(-4000);
		camera.left_top_y.should.equal(-3000);
		camera.scale(.5);
		camera.left_top_x.should.equal(-2000);
		camera.left_top_y.should.equal(-1500);
		camera.scale(.1);
		camera.left_top_x.should.equal(-200);
		camera.left_top_y.should.equal(-150);
	});
});
