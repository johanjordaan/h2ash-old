var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var redis = require('redis');

var CPU = require('../models/cpu.js').CPU;
var cpu_map = require('../maps/cpu_map.js').cpu_map;
var Mapper = require('../utils/mapper.js').Mapper;

var debug_db = 15;

describe('cpu_map',function(){
	beforeEach(function(done) { 
		var client = redis.createClient();
		client.select(debug_db);
		client.FLUSHDB(function() { 
			client.quit();
			done(); 
		});
	});
	it('should save and load cpus',function(done) {
		var cpu = new CPU();
		
		cpu.load([cpu.isa.parse('seti 1,0x33'),cpu.isa.parse('seti 2,0x10'),cpu.isa.parse('seti 3,0x11')]);
		cpu.step();
		cpu.step();
		cpu.r.length.should.equal(16);
		cpu.r[0].should.equal(2);
		cpu.r[1].should.equal(0x33);
		cpu.r[2].should.equal(0x10);
		cpu.r[3].should.equal(0);
		cpu.m.length.should.equal(3);
		
		var mapper = new Mapper(debug_db)
		
		mapper.save(cpu_map,cpu,function(saved_cpu){
			saved_cpu.id.should.equal(1);	
			mapper.load(cpu_map,1,function(loaded_cpu){
				loaded_cpu.r.length.should.equal(16);
				cpu.r[0].should.equal(2);
				loaded_cpu.r[0].should.equal(2);
				loaded_cpu.r[1].should.equal(0x33);
				loaded_cpu.r[2].should.equal(0x10);
				loaded_cpu.r[3].should.equal(0);
				loaded_cpu.m.length.should.equal(3);
				loaded_cpu.m[0].should.equal(cpu.m[0]);
				loaded_cpu.m[1].should.equal(cpu.m[1]);

				loaded_cpu.step();
				loaded_cpu.r[0].should.equal(3);
				loaded_cpu.r[3].should.equal(0x11);
				
				done();
			});
		});
	});
});
