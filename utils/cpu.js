if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
}

var ISA = function() {
	this.instruction_length = 32;
	this.opcode_length = 6
	this.register_length = 4;
	
	this.instructions = {
		1  : {type:'RRR',name:'and' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = cpu.r[r1] & cpu.r[r2]; } },
		2  : {type:'RRR',name:'or'  ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = cpu.r[r1] | cpu.r[r2]; } },
		3  : {type:'RR' ,name:'not' ,action:function(cpu,r0,r1)    { cpu.r[r0] = !cpu.r[r1]?1:0; } },
		4  : {type:'RRR',name:'xor' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = cpu.r[r1] ^ cpu.r[r2]; } },
		5  : {type:'RRR',name:'shr' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = cpu.r[r1] >> cpu.r[r2]; } },
		6  : {type:'RRR',name:'shl' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = cpu.r[r1] << cpu.r[r2]; } },
		7  : {type:'RRR',name:'ror' ,action:function(cpu,r0,r1,r2) { var lsb = cpu.r[r1] & 1; cpu.r[r0] = ((cpu.r[r1] >> cpu.r[r2])|lsb<<31)>>>0 ;} },
		8  : {type:'RRR',name:'rol' ,action:function(cpu,r0,r1,r2) { var msb = cpu.r[r1] & (1<<31); cpu.r[r0] = (cpu.r[r1] << cpu.r[r2])|msb; } },

		9  : {type:'RRR',name:'add' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = (cpu.r[r1]>>>0) + (cpu.r[r2]>>>0) ;  } },
		10 : {type:'RRR',name:'sub' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = ((cpu.r[r1]>>>0) - (cpu.r[r2]>>>0))>>>0 ; } },
		11 : {type:'RRR',name:'mul' ,action:function(cpu,r0,r1,r2) { cpu.r[r0] = cpu.r[r1] * cpu.r[r2] ; } },
		12 : {type:'RRR',name:'div' ,action:function(cpu,r0,r1,r2) { if(cpu.r[r2]!=0) cpu.r[r0] = Math.floor(cpu.r[r1] / cpu.r[r2]) ; } },
		13 : {type:'R'  ,name:'inc' ,action:function(cpu,r0) 	   { cpu.r[r0]++; } },
		14 : {type:'R'  ,name:'dec' ,action:function(cpu,r0) 	   { cpu.r[r0]--; } },
		
		15 : {type:'RR' ,name:'set' ,action:function(cpu,r0,r1)    { cpu.r[r0] = cpu.r[r1]; } },
		16 : {type:'RI' ,name:'seti',action:function(cpu,r0,imm)   { cpu.r[r0] = imm; } },
		17 : {type:'RRI',name:'load',action:function(cpu,r0,r1,imm){ cpu.r[r0] = cpu.m[ cpu.r[r1] + imm ];  } },
		18 : {type:'RRI',name:'stor',action:function(cpu,r0,r1,imm){ cpu.m[ cpu.r[r1] + imm ] = cpu.r[r0];} },
		
		22 : {type:'RRI',name:'je'  ,action:function(cpu,r0,r1,imm){ if(cpu.r[r0] == cpu.r[r1]) cpu.r[0] = imm; } },
		23 : {type:'I'  ,name:'ji'  ,action:function(cpu,imm)      { cpu.r[0] = imm; } },
		24 : {type:'RRI',name:'call',action:function(cpu,r0,r1,imm){ cpu.paused=true; cpu.modules[cpu.r[r0]].call(cpu,cpu.r[r1]+imm,function(){ cpu.paused=false});  } },
		
	};
	this.instructions_by_name = {};
	_.each(this.instructions,function(value,key){
		this.instructions_by_name[value.name] = key;	
	},this);
}
// Str format is o p1,p2,p3,p4
ISA.prototype.parse = function(str) {
	var tokens = str.split(/[\s,]+/);
	var opcode = this.instructions_by_name[tokens[0]];
	var ret_val = Number(opcode)<<((this.instruction_length-this.opcode_length));
	var i = this.instructions[opcode];
	if(i.type=='RRR') {
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2]&0xF)<<((this.instruction_length-this.opcode_length-2*this.register_length));
		ret_val |= Number(tokens[3]&0xF)<<((this.instruction_length-this.opcode_length-3*this.register_length));
	} else 	if(i.type=='RR') {
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2]&0xF)<<((this.instruction_length-this.opcode_length-2*this.register_length));
	} else 	if(i.type=='RRI') {
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2]&0xF)<<((this.instruction_length-this.opcode_length-2*this.register_length));
		ret_val |= Number(tokens[3])
	}else if(i.type=='RI') {
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2])
	} else if(i.type=='R') {
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
	}else if(i.type=='I') {
		ret_val |= Number(tokens[1])
	}
	return ret_val;
}
ISA.prototype.format_instruction = function(instruction) {
	var str = instruction.toString(2);
	var padding_delta = 32-str.length;
	for(var i=0;i<padding_delta;i++) str = '0'+str;
	var ret_val = '';
	for(var i=0;i<32/4;i++) {
		ret_val += str.substr(i*4,4)+' ';
		if(i==3) ret_val += '- '
	}
	return ret_val.trim();
}
ISA.prototype.execute = function(cpu,instruction) {
	var opcode = (instruction&0xFC000000)>>(this.instruction_length-this.opcode_length);
	var r0     = (instruction&0x03C00000)>>(this.instruction_length-this.opcode_length-this.register_length);
	var r1     = (instruction&0x003C0000)>>(this.instruction_length-this.opcode_length-2*this.register_length);
	var r2     = (instruction&0x0003C000)>>(this.instruction_length-this.opcode_length-3*this.register_length);
	//var imm1   = (instruction&0x0000FFFF);

	var i = this.instructions[opcode];
	if(i.type == 'RRR') {
		i.action(cpu,r0,r1,r2);
	} else 	if(i.type == 'RR') {
		i.action(cpu,r0,r1);
	} else 	if(i.type == 'RRI') {
		var imm   = instruction&0x0001FFFF;
		i.action(cpu,r0,r1,imm);
	}else if(i.type == 'RI') {
		var imm   = instruction&0x001FFFFF;
		i.action(cpu,r0,imm);
	} else if(i.type == 'R') {
		i.action(cpu,r0);
	} else if(i.type == 'I') {
		var imm   = instruction&0x03FFFFFF;
		i.action(cpu,imm);
	}
}
var isa = new ISA();

var CPU = function() {
	this.paused = false;
	this.isa = isa;
	this.modules = {};
	this.load([]);
}
CPU.prototype.add_module = function(num,module) {
	this.modules[num] = module;
}
 
CPU.prototype.load = function(m) {
	this.m = m;
	this.r = [];
	for(var i=0;i<16;i++) {
		this.r[i] = 0;
	}
}
CPU.prototype.step = function() {
	if(this.paused) return;
	var ip = this.r[0];
	var c = this.m[ip];
	this.isa.execute(this,c);
	if(ip==this.r[0])
		this.r[0]++;
}

if(typeof module != 'undefined') {
    module.exports.ISA = ISA;
	module.exports.CPU = CPU;
} else {
}