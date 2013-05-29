var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var WorldCanvas = require('../utils/world_canvas.js').WorldCanvas;
var printf = require('../utils/printf.js').printf

describe('clear',function() {
	it('should clear the sreen',function() {
		var context = new Mock();
		
		context.expect('fillRect',[0,0,640,480],function() {
			context.fillStyle.should.equal('black');
		});
		
		var wc = new WorldCanvas(640,480,context);	
		wc.clear();
		
		context.validate(true).status.should.equal('ok');
	});
});

describe('translate',function() {
	it('should translate the camera x and y coordinates to the give location',function() { 
		var context = new Mock();
		var wc = new WorldCanvas(640,480,context);
		wc.world_x.should.equal(0);
		wc.world_y.should.equal(0);
		wc.translate(10,10);
		wc.world_x.should.equal(10);
		wc.world_y.should.equal(10);
		wc.translate(-20,10);
		wc.world_x.should.equal(-10);
		wc.world_y.should.equal(20);
	});
});


describe('draw_grid',function() {
	it('should draw a grid with the given dimesions',function() {
		var context = new Mock(['save','stroke','restore','moveTo','lineTo']);
		var step = 3;
		
		
		var h_moveto_parms = [[0,0],[0,3],[0,6],[0,9]];
		var h_lineto_parms = [[10,0],[10,3],[10,6],[10,9]];
		for(var r=0,i=0;r<10;r+=step,i++) {
			context.expect('moveTo',h_moveto_parms[i]);
			context.expect('lineTo',h_lineto_parms[i]);
		}

		var v_moveto_parms = [[0,0],[3,0],[6,0],[9,0]];
		var v_lineto_parms = [[0,10],[3,10],[6,10],[9,10]];
		for(var c=0,i=0;c<10;c+=step,i++) {
			context.expect('moveTo',v_moveto_parms[i]);
			context.expect('lineTo',v_lineto_parms[i]);
		}
		
		var wc = new WorldCanvas(10,10,context);	
		wc.draw_grid(step);
		
		context.validate(true).status.should.equal('ok');
	});
	
	// Need a test for world offset drawing
})

describe('draw_object',function() {
	it('should draw an object with its lable at the correct spot on the canvas',function() { 
		var context = new Mock(['save','restore','beginPath']);
		
		context.expect('translate',[10,-10]);
		context.expect('arc',[0,0,100,0,2*Math.PI,false]);
		var lable_xy = Math.sqrt((100*100)/2);
		context.expect('moveTo',[lable_xy+2,lable_xy+2]);
		context.expect('lineTo',[106,106]);
		context.expect('fillText',['The Object',106,101]);
		context.expect('measureText',['The Object'],function(text){
			return({width:10});
		});
		context.expect('lineTo',[116,106]);
		context.expect('stroke',[],function(){
			context.strokeStyle.should.equal('yellow');
		});
		
		var wc = new WorldCanvas(100,100,context);	
		wc.draw_object(10,10,100,'The Object','yellow');
		context.validate(true).status.should.equal('ok');
	});
	
	// Need a test for offset drawing
});


