var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;

var redis = require('redis');

var printf = require('../utils/printf.js').printf
var Mapper = require('../utils/mapper.js').Mapper;
var point_map = require('../maps/point_map').point_map;
var vector_map = require('../maps/vector_map').vector_map;

var Point2D = require('../utils/point.js').Point2D;

var debug_db = 15;

describe('vector_map',function() {
	beforeEach(function(done) { 
		var client = redis.createClient();
		client.select(debug_db);
		client.FLUSHDB(function() { 
			client.quit();
			done(); 
		});
	});
	it('should save a vector',function(done) {
		var mapper = new Mapper(debug_db);
		var v = mapper.create(vector_map);
		v.p1.x.should.equal(point_map.fields.x.default_value);
		v.p1.y.should.equal(point_map.fields.y.default_value);
		v.p2.x.should.equal(point_map.fields.x.default_value);
		v.p2.y.should.equal(point_map.fields.y.default_value);

		v.set(new Point2D(0,0),new Point2D(10,10));
		
		mapper.save(v,function(saved_v){
			mapper.load(vector_map,1,function(loaded_v){
				loaded_v.p1.x.should.equal(0);
				loaded_v.p1.y.should.equal(0);
				loaded_v.p2.x.should.equal(10);
				loaded_v.p2.y.should.equal(10);
				loaded_v.dx.should.equal(10);
				loaded_v.dy.should.equal(10);
				loaded_v.length.should.equal(Math.sqrt(100+100));
				done();
			});
		});
	});
});
