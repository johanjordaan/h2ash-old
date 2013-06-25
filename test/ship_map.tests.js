var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var redis = require('redis');
var Mapper = require('../utils/mapper.js').Mapper;


var ShipType = require('../models/ship_type.js').ShipType;
var Ship = require('../models/ship.js').Ship;
var ship_type_map = require('../maps/ship_type_map').ship_type_map;
var ship_map = require('../maps/ship_map').ship_map;

var debug_db = 15;

describe('ship_map',function(){
	beforeEach(function(done) { 
		var client = redis.createClient();
		client.select(debug_db);
		client.FLUSHDB(function() { 
			client.quit();
			done(); 
		});
	});
	it('should save and load propulsion modules',function(done) {
		var type_source = {name:'test ship'}
		var type = new ShipType(ship_type_map,type_source)
		
		var ship_source = { type:type }
		var ship = new Ship(ship_map,ship_source)
		
		var mapper = new Mapper(debug_db)
		
		mapper.save(ship_map,ship,function(saved_ship){
			saved_ship.id.should.equal(1);	
			mapper.load(ship_map,1,function(loaded_ship){
				loaded_ship.type.name.should.equal(type.name);
				
				done();
			});
		});
	});
});
