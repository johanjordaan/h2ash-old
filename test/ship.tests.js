var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var ShipType = require('../models/ship_type.js').ShipType;
var Ship = require('../models/ship.js').Ship;
var ship_map = require('../maps/ship_map.js').ship_map;
var ship_type_map = require('../maps/ship_type_map.js').ship_type_map;


describe('ShipType',function(){
	describe('#constructor',function() {
		it('should create a new ship type base on the map and the source',function() {
			var simple_type = {name:'test ship'}
			var type = new ShipType(ship_type_map,simple_type)
		
			type.name.should.equal(simple_type.name);
			type.description.should.equal('');
		});
	});
});

describe('Ship',function(){
	describe('#constructor',function() {
		it('should create a new ship base on the map and the source',function() {
			var type_source = {name:'test ship'}
			var type = new ShipType(ship_type_map,type_source)
			
			var ship_source = { type:type }
			var ship = new Ship(ship_map,ship_source)
			
			ship.type.name.should.equal(type_source.name);	
			
		});
	});
});
