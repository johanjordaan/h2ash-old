var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var printf = require('../utils/printf.js').printf

var Camera = require('../utils/camera.js').Camera;
var Screen = require('../utils/screen.js').Screen;
var Scene = require('../utils/scene.js').Scene;

var PlanetFX = require('../fx/planet_fx.js').PlanetFX;

describe('PlanetFX',function() {
	describe('#render',function() {
		it('should should render the planet fx correctly at',function() { 
			var context = new Mock(['save','restore','beginPath']);
			
			var screen = new Screen(640,480,context);
			var camera = new Camera(14960000,0,0.007848062);	// Should reduce radius to 50
			var scene = new Scene(screen,camera);
			
			var earth = new PlanetFX(scene,{x:14960000,y:0,color:'blue',radius:6371,label:'earth'});
						
			context.expect('translate',[14960000*0.007848062,0]);
			context.expect('arc',[0,0,50,0,2*Math.PI,false]);
			context.expect('stroke',[],function(){	
				context.strokeStyle.should.equal('blue');
			});


			var lable_xy = Math.sqrt((50*50)/2);
			context.expect('moveTo',[lable_xy+2,lable_xy+2]);
			context.expect('lineTo',[56,56]);
			context.expect('fillText',['earth',56,51]);
			context.expect('measureText',['earth'],function(text){
				return({width:10});
			});
			context.expect('lineTo',[66,56]);
			context.expect('stroke',[],function(){
				context.strokeStyle.should.equal('gray');
			});
			
			earth.render(scene,10)

			context.validate(true).status.should.equal('ok');
		});
		
		// Need a test for offset drawing
	});
});

