var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var NavigationModuleType = require('../models/navigation_module_type.js').NavigationModuleType;
var NavigationModule = require('../models/navigation_module.js').NavigationModule;
var navigation_module_map = require('../maps/navigation_module_map.js').navigation_module_map;
var navigation_module_type_map = require('../maps/navigation_module_type_map.js').navigation_module_type_map;


describe('NavigationModuleType',function(){
	describe('#constructor',function() {
		it('should create a new navigation module type base on the map and the source',function() {
			var simple_type = {name:'test module',latency:1000}
			var type = new NavigationModuleType(navigation_module_type_map,simple_type)
			
			type.name.should.equal(simple_type.name);
			type.description.should.equal('');
			type.latency.should.equal(simple_type.latency);
			
		});
	});
});

describe('NavigationModule',function(){
	describe('#constructor',function() {
		it('should create a new navigation object base on the map and the source',function() {
			var type_source = {name:'test module',latency:1000}
			var type = new NavigationModuleType(navigation_module_type_map,type_source)
			
			var nm_source = { activated:false,type:type }
			var nm = new NavigationModule(navigation_module_map,nm_source)
			
			nm.activated.should.equal(false);
			nm.target_x.should.equal(0);
			nm.target_y.should.equal(0);
			
		});
	});
	
	describe('#set_target',function(){
		it('should set the target of the module to the specified values',function(){
			var type_source = {name:'test module',latency:1000}
			var type = new NavigationModuleType(navigation_module_type_map,type_source)
			
			var nm_source = { activated:false,type:type }
			var nm = new NavigationModule(navigation_module_map,nm_source)
			
			nm.set_target(20,300000);
			nm.target_x.should.equal(20);
			nm.target_y.should.equal(300000);

			nm.set_target(-222200,80);
			nm.target_x.should.equal(-222200);
			nm.target_y.should.equal(80);
			
		});
	});
	
});
