var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var Screen = require('../utils/screen.js').Screen;
var printf = require('../utils/printf.js').printf

describe('Screen',function() {
	describe('#Constructor',function() {
		it('should construct a new screen object',function() {
			var context = new Mock();
		
			context.expect('fillRect',[0,0,640,480],function() {
				context.fillStyle.should.equal('black');
			});
			
			var screen = new Screen(640,480,context);	
			screen.width.should.equal(640);
			screen.height.should.equal(480);
			screen.aspect_ratio.should.equal(640/480);
		});
	});

	describe('#clear',function() {
		it('should clear the sreen',function() {
			var context = new Mock();
		
			context.expect('fillRect',[0,0,640,480],function() {
				context.fillStyle.should.equal('black');
			});
			
			var screen = new Screen(640,480,context);	
			screen.clear();
			
			context.validate(true).status.should.equal('ok');
		});
	});
});
