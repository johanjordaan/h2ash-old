var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var redis = require('redis');
var Mapper = require('../utils/mapper.js').Mapper;


var PropulsionModuleType = require('../models/propulsion_module_type.js').PropulsionModuleType;
var PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;
var propulsion_module_type_map = require('../maps/propulsion_module_type_map').propulsion_module_type_map;
var propulsion_module_map = require('../maps/propulsion_module_map').propulsion_module_map;

var debug_db = 15;

describe('propulsion_module_map',function(){
	beforeEach(function(done) { 
		var client = redis.createClient();
		client.select(debug_db);
		client.FLUSHDB(function() { 
			client.quit();
			done(); 
		});
	});
	it('should save and load propulsion modules',function(done) {
		var type_source = {name:'test module',max_speed:30,latency:1000}
		var type = new PropulsionModuleType(propulsion_module_type_map,type_source)
		
		var pm_source = { activated:false,speed:20,type:type }
		var pm = new PropulsionModule(propulsion_module_map,pm_source)
		pm.set_speed(10);
		
		var mapper = new Mapper(debug_db)
		
		mapper.save(propulsion_module_map,pm,function(saved_pm){
			saved_pm.id.should.equal(1);	
			mapper.load(propulsion_module_map,1,function(loaded_pm){
				loaded_pm.speed.should.equal(3);
				loaded_pm.activated.should.equal(false);
				loaded_pm.type.max_speed.should.equal(30);
				loaded_pm.type.latency.should.equal(1000);
				loaded_pm.type.name.should.equal('test module');
				
				done();
			});
		});
	});
});
