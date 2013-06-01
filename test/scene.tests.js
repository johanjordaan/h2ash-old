var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;


var Screen = require('../utils/screen.js').Screen;
var Camera = require('../utils/camera.js').Camera;
var Scene = require('../utils/scene.js').Scene;
var printf = require('../utils/printf.js').printf

describe('Scene',function() {
	describe('#Constructor',function() {
		it('should construct a new scene object',function() {
			var context = new Mock();
			var screen = new Screen(640,480,context);	
			var camera = new Camera(0,0,6400,screen.aspect_ratio)
			var scene = new Scene(screen,camera);
			
			scene.nodes.length.should.equal(0);
		});
	});
	describe('#render',function() {
		it('should add a new scene node to the node',function() {
			var context = new Mock();
			var screen = new Screen(640,480,context);	
			var camera = new Camera(0,0,6400,screen.aspect_ratio)
			var scene = new Scene(screen,camera);
			
			var node = new Mock();
			node.expect('render',[]);
						
			scene.nodes.push(node);
			
			scene.render();
			
			node.validate(true).status.should.equal('ok');
		});
	});

});
