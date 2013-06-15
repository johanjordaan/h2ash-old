var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var ISA = require('../utils/cpu.js').ISA;
var CPU = require('../utils/cpu.js').CPU;

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
	});
	describe('#execute',function() {
		
		it('should execute the seti instruction',function() {
			var isa = new ISA();
			var cpu = {r:[]}
			isa.execute(cpu,isa.parse('seti 2,0x10'));
			cpu.r[2].should.equal(0x10);

			// This is the test for clamping the register to 0-F
			isa.execute(cpu,isa.parse('seti 0xFF,0x10'));
			cpu.r[15].should.equal(0x10);
		});
		it('should execute the and instruction',function() {
			var isa = new ISA();
			var cpu = {r:[]}
			isa.execute(cpu,isa.parse('seti 2,0x10'));
			isa.execute(cpu,isa.parse('seti 3,0x1F'));
			
			isa.execute(cpu,isa.parse('and 4,2,3'));
			cpu.r[3].should.equal(0x1F);
			cpu.r[4].should.equal(0x10);
			
			isa.execute(cpu,isa.parse('and 4,2,2'));
			cpu.r[4].should.equal(0x10);

			isa.execute(cpu,isa.parse('and 4,2,9'));
			cpu.r[4].should.equal(0x0);
		});
		it('should execute the ji instruction',function() {
			var isa = new ISA();
			var cpu = {r:[]}
			isa.execute(cpu,isa.parse('seti 2,0x10'));
			isa.execute(cpu,isa.parse('seti 3,0x1F'));
			
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
			cpu.load([mcode]);
			cpu.r[0].should.equal(0);
			cpu.m.length.should.equal(1);
			cpu.m[0].should.equal(mcode);
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
			cpu.step();
			cpu.r[0].should.equal(1);
			cpu.r[3].should.equal(0x20);
			cpu.step();
			cpu.r[0].should.equal(2);
			cpu.r[4].should.equal(0x10);
			cpu.step();
			cpu.r[0].should.equal(3);
			cpu.r[3].should.equal(0);
			cpu.step();
			cpu.r[0].should.equal(2);
		});
	});
	
	
});

