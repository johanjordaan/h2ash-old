var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var Camera = require('../utils/camera.js').Camera;

describe('Camera',function(){
	it('#constructor',function() {
		var camera = new Camera(0,0,1);
		camera.center_x.should.equal(0);
		camera.center_y.should.equal(0);
		camera.magnification.should.equal(1);
	});
	it('#translate',function() { 
		var camera = new Camera(0,0,4);
		camera.translate(-10,-10);
		camera.center_x.should.equal(-10);
		camera.center_y.should.equal(-10);
		camera.magnification.should.equal(4);
		
		camera.translate(0,20);
		camera.center_x.should.equal(-10);
		camera.center_y.should.equal(10);
		camera.magnification.should.equal(4);

		camera.translate(-20,0);
		camera.center_x.should.equal(-30);
		camera.center_y.should.equal(10);
		camera.magnification.should.equal(4);
	});
});
