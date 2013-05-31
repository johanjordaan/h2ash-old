var _ = require('underscore');
var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;
var printf = require('../utils/printf.js').printf


var time = require('../utils/time.js');

describe('get_timestamp',function() {
	it('should return a timestamp',function() {
		new Mock(process);
		
		process.expect('hrtime',[],function(){ return [1,0] });
		
		var ts = time.get_timestamp();
		ts.should.equal(1000);
		
		process.validate(true).status.should.equal('ok');
	});
});
