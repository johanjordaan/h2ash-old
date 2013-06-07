var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var printf = require('../utils/printf.js').printf


var Screen = require('../utils/screen.js').Screen;
var Camera = require('../utils/camera.js').Camera;
var SceneNode = require('../utils/scene.js').SceneNode;
var Scene = require('../utils/scene.js').Scene;

describe('SceneNode',function() { 
	describe('#constructor',function(){
		it('should create a new scene node with no child nodes',function(){
			var n = new SceneNode();
			n.children.length.should.equal(0);
		});
	});
	describe('#add_child_node',function(){
		it('should add a child node to the nodes children',function(){
			var n = new SceneNode();
			n.add_child_node(new SceneNode());
		});
	});
	describe('#render',function(){
		it('should call render and render_children',function(){
			var parent = new Mock(new SceneNode());
			var child = new Mock(new SceneNode());

			parent.expect('add_child_node',[child]);
			parent.expect('render',[10]);
			parent.expect('render_children',[parent,10]);
			child.expect('render',[10]);
			
			parent.add_child_node(child);
			parent.render(10);
			
		});
	});
});


describe('Scene',function() {
	describe('#constructor',function() {
		it('should construct a new scene object',function() {
			var context = new Mock();
			var screen = new Screen(640,480,context);	
			var camera = new Camera(0,0,6400,screen.aspect_ratio)
			var scene = new Scene(screen,camera);
			
			scene.children.length.should.equal(0);
		});
	});
	describe('#render',function() {
		it('should render the scenes nodes',function() {
			var context = new Mock(['save','translate','restore']);
			var screen = new Screen(640,480,context);	
			var camera = new Camera(0,0,6400,screen.aspect_ratio)
			var scene = new Scene(screen,camera);
			
			scene.add_child_node(new SceneNode());
			
			var scene = new Mock(scene);
			scene.expect('render_children',[10]);	
			
			scene.render(10);
			
			scene.validate(true).status.should.equal('ok');
		});
	});

});
