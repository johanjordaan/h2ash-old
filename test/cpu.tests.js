var util = require('util');
var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var ISA = require('../models/cpu.js').ISA;
var CPU = require('../models/cpu.js').CPU;

describe('ISA',function(){
	describe('#parse',function() {
		var isa = new ISA();

		// Logical instructions
		//
		it('should parse the and instruction',function() {
			var mcode = isa.parse('and 3,2,1');
			isa.format_instruction(mcode).should.equal('0000 0100 1100 1000 - 0100 0000 0000 0000')
		});
		it('should parse the or instruction',function() {
			var mcode = isa.parse('or 3,2,1');
			isa.format_instruction(mcode).should.equal('0000 1000 1100 1000 - 0100 0000 0000 0000')
		});
		it('should parse the not instruction',function() {
			var mcode = isa.parse('not 3,2');
			isa.format_instruction(mcode).should.equal('0000 1100 1100 1000 - 0000 0000 0000 0000')
		});
		it('should parse the not instruction',function() {
			var mcode = isa.parse('xor 3,2');
			isa.format_instruction(mcode).should.equal('0001 0000 1100 1000 - 0000 0000 0000 0000')
		});
		it('should parse the shr instruction',function() {
			var mcode = isa.parse('shr 3,2,1');
			isa.format_instruction(mcode).should.equal('0001 0100 1100 1000 - 0100 0000 0000 0000')
		});
		it('should parse the shl instruction',function() {
			var mcode = isa.parse('shl 3,2,4');
			isa.format_instruction(mcode).should.equal('0001 1000 1100 1001 - 0000 0000 0000 0000')
		});
		it('should parse the ror instruction',function() {
			var mcode = isa.parse('ror 3,2,1');
			isa.format_instruction(mcode).should.equal('0001 1100 1100 1000 - 0100 0000 0000 0000')
		});
		it('should parse the rol instruction',function() {
			var mcode = isa.parse('rol 3,2,4');
			isa.format_instruction(mcode).should.equal('0010 0000 1100 1001 - 0000 0000 0000 0000')
		});

		// Arthmatic instructions
		//
		it('should parse the add instruction',function() {
			var mcode = isa.parse('add 3,2,4');
			isa.format_instruction(mcode).should.equal('0010 0100 1100 1001 - 0000 0000 0000 0000')
		});
		it('should parse the sub instruction',function() {
			var mcode = isa.parse('sub 3,2,4');
			isa.format_instruction(mcode).should.equal('0010 1000 1100 1001 - 0000 0000 0000 0000')
		});
		it('should parse the mul instruction',function() {
			var mcode = isa.parse('mul 3,2,4');
			isa.format_instruction(mcode).should.equal('0010 1100 1100 1001 - 0000 0000 0000 0000')
		});
		it('should parse the div instruction',function() {
			var mcode = isa.parse('div 3,2,4');
			isa.format_instruction(mcode).should.equal('0011 0000 1100 1001 - 0000 0000 0000 0000')
		});
		it('should parse the inc instruction',function() {
			var mcode = isa.parse('inc 10');
			isa.format_instruction(mcode).should.equal('0011 0110 1000 0000 - 0000 0000 0000 0000')
		});
		it('should parse the dec instruction',function() {
			var mcode = isa.parse('dec 10');
			isa.format_instruction(mcode).should.equal('0011 1010 1000 0000 - 0000 0000 0000 0000')
		});
		
		// Data movement instructions
		//
		it('should parse the set instruction',function() {
			var mcode = isa.parse('set 2,7');
			isa.format_instruction(mcode).should.equal('0011 1100 1001 1100 - 0000 0000 0000 0000')
		});
		it('should parse the seti instruction',function() {
			var mcode = isa.parse('seti 2,0x10');
			isa.format_instruction(mcode).should.equal('0100 0000 1000 0000 - 0000 0000 0001 0000')
		});
		it('should parse the load instruction',function() {
			var mcode = isa.parse('load 2,1,0x10');
			isa.format_instruction(mcode).should.equal('0100 0100 1000 0100 - 0000 0000 0001 0000')
		});
		it('should parse the stor instruction',function() {
			var mcode = isa.parse('stor 2,1,0x10');
			isa.format_instruction(mcode).should.equal('0100 1000 1000 0100 - 0000 0000 0001 0000')
		});
		
		// Flow control instructions
		//
		it('should parse the je instruction',function() {
			var mcode = isa.parse('je 3,2,0x30');
			isa.format_instruction(mcode).should.equal('0101 1000 1100 1000 - 0000 0000 0011 0000')
		});
		it('should parse the ji instruction',function() {
			var mcode = isa.parse('ji 0x30');
			isa.format_instruction(mcode).should.equal('0101 1100 0000 0000 - 0000 0000 0011 0000')
		});
		it('should parse the call instruction',function() {
			var mcode = isa.parse('call 1,2,0x30');
			isa.format_instruction(mcode).should.equal('0110 0000 0100 1000 - 0000 0000 0011 0000')
		});
	});
	describe('#execute',function() {
		
		// We need to test this first since it is used in all the other tests
		//
		it('should execute the seti instruction',function() {
			var isa = new ISA();
			var cpu = {r:[]}
			isa.execute(cpu,isa.parse('seti 2,0x10'));
			cpu.r[2].should.equal(0x10);

			// This is the test for clamping the register to 0-F
			isa.execute(cpu,isa.parse('seti 0xFF,0x10'));
			cpu.r[15].should.equal(0x10);
		});
		

		var isa = new ISA();
		var cpu = {r:[],m:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0x99]}

		
		// Test the RRR instructions
		//
		var RRR_test_set = [
			[2,0x10,3,0x1F,4,{and:0x10 , or:0x1F , xor:0x0F , shr:0x00 , shl:0x00 ,ror:0x00		  , rol:0x00 , add:0x2F , sub:0xFFFFFFF1 , mul:0x1F0 , div:0x00 } ],
			[2,0x01,3,0x01,4,{and:0x01 , or:0x01 , xor:0x00 , shr:0x00 , shl:0x02 ,ror:0x80000000 , rol:0x02 , add:0x02 , sub:0x00       , mul:0x001 , div:0x01 } ],
			[2,0x02,3,0x01,4,{and:0x00 , or:0x03 , xor:0x03 , shr:0x01 , shl:0x04 ,ror:0x01		  , rol:0x04 , add:0x03 , sub:0x01       , mul:0x002 , div:0x02 } ],
		];
		var RRR_test = function(op) {
			_.each(RRR_test_set,function(test){
				isa.execute(cpu,isa.parse(util.format('seti %s,%s',test[0],test[1])));
				isa.execute(cpu,isa.parse(util.format('seti %s,%s',test[2],test[3])));
				isa.execute(cpu,isa.parse(util.format('%s %s,%s,%s',op,test[4],test[0],test[2])));
				cpu.r[test[4]].should.equal(test[5][op],test);
			});
		}
		var RR_test_set = [
			[2,0x10,8,{not:0x00 , set:0x10 } ],
			[2,0x00,8,{not:0x01 , set:0x00 } ],
		];
		var RR_test = function(op) {
			_.each(RR_test_set,function(test){
				isa.execute(cpu,isa.parse(util.format('seti %s,%s',test[0],test[1])));
				isa.execute(cpu,isa.parse(util.format('%s %s,%s',op,test[2],test[0])));
				cpu.r[test[2]].should.equal(test[3][op],test);
			});
		}
		var R_test_set = [
			[2,0x10,2,{inc:0x11 , dec:0x0F} ],
		];

		var R_test = function(op) {
			_.each(R_test_set,function(test){
				isa.execute(cpu,isa.parse(util.format('seti %s,%s',test[0],test[1])));
				isa.execute(cpu,isa.parse(util.format('%s %s,%s,%s',op,test[2])));
				cpu.r[test[2]].should.equal(test[3][op],test);
			});
		}
				
		it('should execute the and instruction',function() { RRR_test('and') });
		it('should execute the or instruction',function()  { RRR_test('or') });
		it('should execute the xor instruction',function() { RRR_test('xor') });
		it('should execute the shr instruction',function() { RRR_test('shr') });
		it('should execute the shl instruction',function() { RRR_test('shl') });
		it('should execute the ror instruction',function() { RRR_test('ror') });
		it('should execute the rol instruction',function() { RRR_test('rol') });
		it('should execute the add instruction',function() { RRR_test('add') });
		it('should execute the sub instruction',function() { RRR_test('sub') });
		it('should execute the mul instruction',function() { RRR_test('mul') });
		it('should execute the div instruction',function() { RRR_test('div') });
		it('should execute the not instruction',function() { RR_test('not') });
		it('should execute the set instruction',function() { RR_test('set') });
		it('should execute the inc instruction',function() { R_test('inc') });
		it('should execute the dec instruction',function() { R_test('dec') });

		it('should execute the load instruction',function() { 
			cpu.m[8] = 0x99;
			isa.execute(cpu,isa.parse('seti 3,0x03'));
			isa.execute(cpu,isa.parse('load 2,3,0x05'));
			cpu.r[2].should.equal(0x99);
		});

		it('should execute the stor instruction',function() { 
			isa.execute(cpu,isa.parse('seti 2,0xCC'));
			isa.execute(cpu,isa.parse('seti 3,0x10'));
			isa.execute(cpu,isa.parse('stor 2,3,0x02'));
			cpu.m[0x12].should.equal(0xCC);
		});

		
		it('should execute the je instruction',function() {
			isa.execute(cpu,isa.parse('seti 0,0x00'));
			isa.execute(cpu,isa.parse('seti 9,0x89'));
			isa.execute(cpu,isa.parse('seti 8,0x89'));
			isa.execute(cpu,isa.parse('je 8,9,0x10'));
			cpu.r[0].should.equal(0x10);
			isa.execute(cpu,isa.parse('seti 0,0x00'));
			isa.execute(cpu,isa.parse('je 0,8,0x10'));
			cpu.r[0].should.equal(0x00);
		});
		
		it('should execute the ji instruction',function() {
			isa.execute(cpu,isa.parse('seti 0,0x00'));
			isa.execute(cpu,isa.parse('ji 1'));
			cpu.r[0].should.equal(1);
		});
	});
});


describe('CPU',function(){
	describe('#constructor',function() {
		it('should create a new cpu with its registers and memory initialised',function() {
			var cpu = new CPU();
			cpu.m.should.be.a('Array');		
			cpu.m.length.should.equal(0);
			cpu.r.should.be.a('Array');
			cpu.r.length.should.equal(16);
			for(var i=0;i<16;i++) {
				cpu.r[i].should.equal(0);
			}
		});
	});

	describe('#load',function() {
		it('should load the program into the memory of the cpu and reset the cpu registers',function() {
			var cpu = new CPU();
			cpu.r[0] = 20;

			var mcode = cpu.isa.parse('seti 3,0x20');
			cpu.load([mcode],1000);
			cpu.r[0].should.equal(0);
			cpu.m.length.should.equal(1);
			cpu.m[0].should.equal(mcode);
			cpu.last_update.should.equal(1000);
		});
	});

	describe('#pause',function() {
		it('should pause execution of the cpu ',function() {
			var cpu = new CPU();
			cpu.pause(1000);
			cpu.last_update.should.equal(1000);
			cpu.paused.should.equal(true);
		});
	});

	describe('#un_pause',function() {
		it('should resume execution of the cpu after being paused',function() {
			var cpu = new CPU();
			cpu.pause(1000);
			cpu.last_update.should.equal(1000);
			cpu.paused.should.equal(true);
			cpu.un_pause(2000);
			cpu.last_update.should.equal(2000);
			cpu.paused.should.equal(false);
		});
	});

	
	describe('#step',function() {
		it('should execute the current instruction and update the pc(register 0) as required ',function() {
			var cpu = new CPU();
			var p = [
				cpu.isa.parse('seti 3,0x20'),
				cpu.isa.parse('seti 4,0x10'),
				cpu.isa.parse('and 3,3,4'),
				cpu.isa.parse('ji 2'),
			];
			
			cpu.load(p);
			cpu.m.length.should.equal(4);
			cpu.step(1000);
			cpu.r[0].should.equal(1);
			cpu.r[3].should.equal(0x20);
			cpu.last_update.should.equal(1000);
			cpu.step(2000);
			cpu.r[0].should.equal(2);
			cpu.r[4].should.equal(0x10);
			cpu.last_update.should.equal(2000);
			cpu.step(3000);
			cpu.r[0].should.equal(3);
			cpu.r[3].should.equal(0);
			cpu.last_update.should.equal(3000);
			cpu.step(4000);
			cpu.r[0].should.equal(2);
			cpu.last_update.should.equal(4000);
		});
		
		it('should pause when when a call has not returned yet',function() {
			var cpu = new CPU();
			cpu.add_module(0x09,{
				call:function(cpu,offset,callback) {  
					cpu.paused.should.equal(true);
					callback(4000);
					cpu.paused.should.equal(false);
					cpu.last_update.should.equal(4000);
				}
			});

			
			var p = [
				cpu.isa.parse('seti 2,0x09'),
				cpu.isa.parse('seti 3,0x05'),
				cpu.isa.parse('call 2,3,0x00'),
				cpu.isa.parse('xor 2,2,2'),
				cpu.isa.parse('ji 3'),
				0x01
			];
			
			cpu.load(p);
			cpu.step(1000);
			cpu.step(2000);
			cpu.step(3000);
			cpu.paused.should.equal(false);
			cpu.r[0].should.equal(3);
			cpu.last_update.should.equal(3000);
			cpu.m.length.should.equal(6);
			
		});
		
		it('should do nothing if the IP point to a memory location with nothing',function() {
			var cpu = new CPU();
			cpu.step(1000);
			cpu.r[0].should.equal(0);
			
			cpu.load([0,0]);
			cpu.step(2000);
			cpu.r[0].should.equal(1);
			
		});


	});
	
	
});

