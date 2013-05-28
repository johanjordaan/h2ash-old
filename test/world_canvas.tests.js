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
		wc.draw_grid(0,0,step);
		
		context.validate(true).status.should.equal('ok');
	});
})
