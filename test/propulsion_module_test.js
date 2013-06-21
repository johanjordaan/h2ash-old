var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var PropulsionModuleType = require('../models/propulsion_module_type.js').PropulsionModuleType;
var PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;
var propulsion_module_map = require('../maps/propulsion_module_map.js').propulsion_module_map;
var propulsion_module_type_map = require('../maps/propulsion_module_type_map.js').propulsion_module_type_map;


describe('PropulsionModuleType',function(){
	describe('#constructor',function() {
		it('should create a new propulsion module type base on the map and the source',function() {
			var simple_type = {name:'test module',max_speed:30,latency:1000}
			var type = new PropulsionModuleType(propulsion_module_type_map,simple_type)
			
			type.name.should.equal(simple_type.name);
			//type.description.should.equal('');	//We do a mapper update so defaults are ignored 
			type.max_speed.should.equal(simple_type.max_speed);
			type.latency.should.equal(simple_type.latency);
			
		});
	});
});

describe('PropulsionModule',function(){
	describe('#constructor',function() {
		it('should create a new celestial object base on the map and the source',function() {
			var type_source = {name:'test module',max_speed:30,latency:1000}
			var type = new PropulsionModuleType(propulsion_module_type_map,type_source)
			
			var pm_source = { activated:false,speed:20,type:type }
			var pm = new PropulsionModule(propulsion_module_map,pm_source)
			
			pm.activated.should.equal(false);
			pm.speed.should.equal(20);
			
		});
	});
	
	describe('#set_speed',function(){
		it('should set the speed of the module to the specified percentage of the max_speed',function(){
			var type_source = {name:'test module',max_speed:30,latency:1000}
			var type = new PropulsionModuleType(propulsion_module_type_map,type_source)
			var pm_source = { type:type}
			var pm = new PropulsionModule(propulsion_module_map,pm_source)
			
			pm.speed.should.equal(0);
			
		});
	});
	
	describe('#get_speed',function(){
	});
});
