var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var printf = require('../utils/printf.js').printf

var Camera = require('../utils/camera.js').Camera;
var Screen = require('../utils/screen.js').Screen;
var Scene = require('../utils/scene.js').Scene;

var GridFX = require('../fx/grid_fx.js').GridFX;

describe('GridFX',function() {
	describe('#render',function() {
		it('should should render the grid fx correctly at the specified location',function() { 
			var context = new Mock(['save','restore','beginPath','moveTo','lineTo']);
			
			var screen = new Screen(640,480,context);
			var camera = new Camera(14960000,0,0.007848062);
			var scene = new Scene(screen,camera);
			
			var step = 40;
			var grid = new GridFX(scene,{color:'gray',step:step});
			
			var x_offset = camera.center_x*camera.magnification - screen.width/2;
			var y_offset = camera.center_y*camera.magnification - screen.height/2;
			
			context.expect('stroke',[],function(){
				context.strokeStyle.should.equal('gray');
			});
			
			/*context.expect('arc',[0,0,50,0,2*Math.PI,false]);
			var lable_xy = Math.sqrt((50*50)/2);
			context.expect('moveTo',[lable_xy+2,lable_xy+2]);
			context.expect('lineTo',[56,56]);
			context.expect('fillText',['earth',56,51]);
			context.expect('measureText',['earth'],function(text){
				return({width:10});
			});
			context.expect('lineTo',[66,56]);
*/
			
			grid.render()

			context.validate(true).status.should.equal('ok');
		});
		
		// Need a test for offset drawing
	});
});

