var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var ShipModule = require('../models/ship_module.js').ShipModule;
var ship_module_map = require('../maps/ship_module_map.js').ship_module_map;

var test_commands = {
	0x01 : { name:'test_command_1' , latency:1.1 , action:function(r) { r[2] = 0xC9;} },
}

describe('ShipModule',function(){
	describe('#constructor',function() {
		it('should create a new ship module',function() {
			var source = {base_latency:1000}
			var ship_module = new ShipModule(ship_module_map,source);
			ship_module.commands = test_commands;
			
			ship_module.base_latency.should.equal(1000);
			ship_module.activated.should.equal(false);
			ship_module.completion_time.should.equal(0);
		});
	});
	
	describe('#call',function(){
		it('should initiuate a call to the module',function(){
			var source = {base_latency:1000}
			var ship_module = new ShipModule(ship_module_map,source);
			ship_module.commands = test_commands;

			var cpu = { r:[] , m:[] };
			cpu.r[1] = 0x01;	
			ship_module.call(cpu,function(){
			});	
			ship_module.update(1000);	
		});
	});
	
	describe('#call/update',function(){
		it('should set the speed of the module to the specified percentage of the max_speed',function(){
		});
	});
});
