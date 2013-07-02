var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var redis = require('redis');
var Mapper = require('../utils/mapper.js').Mapper;


var NavigationModuleType = require('../models/navigation_module_type.js').NavigationModuleType;
var NavigationModule = require('../models/navigation_module.js').NavigationModule;
var Ship = require('../models/ship.js').Ship;
var propulsion_module_type_map = require('../maps/navigation_module_type_map').propulsion_module_type_map;
var navigation_module_map = require('../maps/navigation_module_map').navigation_module_map;
var ship_map = require('../maps/ship_map.js').ship_map;

var debug_db = 15;

describe('navigation_module_map',function(){
	beforeEach(function(done) { 
		var client = redis.createClient();
		client.select(debug_db);
		client.FLUSHDB(function() { 
			client.quit();
			done(); 
		});
	});
	it('should save and load navigation modules',function(done) {
		var type_source = {name:'test module',latency:1000}
		var type = new NavigationModuleType(navigation_module_type_map,type_source)
		
		var nm_source = { activated:false,speed:20,type:type }
		var nm = new NavigationModule(navigation_module_map,nm_source)

		var ship = new Ship(ship_map,{});
		ship.add_module(nm);

		var mapper = new Mapper(debug_db)
		
		mapper.save(navigation_module_map,nm,function(saved_nm){
			saved_nm.id.should.equal(1);	
			mapper.load(navigation_module_map,1,function(loaded_nm){
				loaded_nm.activated.should.equal(false);
				loaded_nm.type.latency.should.equal(1000);
				loaded_nm.type.name.should.equal('test module');
			
				done();
			});
		});
	});
});
