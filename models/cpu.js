if(typeof(require) == 'undefined') {
} else {
	_ = require('underscore');
	time = require('../utils/time.js');
	mapper = require('../utils/mapper.js');
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
		24 : {type:'RRI',name:'call',action:function(cpu,r0,r1,imm,timestamp){ cpu.pause(timestamp); cpu.modules[cpu.r[r0]].call(cpu,cpu.r[r1]+imm,function(timestamp){ cpu.un_pause(timestamp);});  } },
		
	};
	this.instructions_by_name = {};
	_.each(this.instructions,function(value,key){
		this.instructions_by_name[value.name] = key;	
	},this);
}
// Str format is o p1,p2,p3,p4 -
// If the instruction is not found then a zero is emited
// Returns a structure { ok:<true/false> error:, mcode:} on any error a zero is emitted
ISA.prototype._parse = function(str) {
	var tokens = str.split(/[\s,]+/);
	var opcode = this.instructions_by_name[tokens[0]];
	var ret_val = Number(opcode)<<((this.instruction_length-this.opcode_length));
	var i = this.instructions[opcode];
	if(_.isUndefined(i)) return {ok:false,msg:'Unknown instruction ['+tokens[0]+']',mcode:0};
	if(i.type=='RRR') {
		if(tokens.length<4) return {ok:false,msg:'Insufficient parameters for instruction ['+tokens[0]+']',mcode:0};
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2]&0xF)<<((this.instruction_length-this.opcode_length-2*this.register_length));
		ret_val |= Number(tokens[3]&0xF)<<((this.instruction_length-this.opcode_length-3*this.register_length));
	} else 	if(i.type=='RR') {
		if(tokens.length<3) return {ok:false,msg:'Insufficient parameters for instruction ['+tokens[0]+']',mcode:0};
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2]&0xF)<<((this.instruction_length-this.opcode_length-2*this.register_length));
	} else 	if(i.type=='RRI') {
		if(tokens.length<4) return {ok:false,msg:'Insufficient parameters for instruction ['+tokens[0]+']',mcode:0};
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2]&0xF)<<((this.instruction_length-this.opcode_length-2*this.register_length));
		ret_val |= Number(tokens[3])
	}else if(i.type=='RI') {
		if(tokens.length<3) return {ok:false,msg:'Insufficient parameters for instruction ['+tokens[0]+']',mcode:0};
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
		ret_val |= Number(tokens[2])
	} else if(i.type=='R') {
		if(tokens.length<2) return {ok:false,msg:'Insufficient parameters for instruction ['+tokens[0]+']',mcode:0};
		ret_val |= Number(tokens[1]&0xF)<<((this.instruction_length-this.opcode_length-this.register_length));
	}else if(i.type=='I') {
		if(tokens.length<2) return {ok:false,msg:'Insufficient parameters for instruction ['+tokens[0]+']',mcode:0};
		ret_val |= Number(tokens[1])
	}
	return {ok:true,msg:'',mcode:ret_val};
}
ISA.prototype.parse = function(str) {
	var that = this;
	var lines = str.split(/[\n\r]+/);
	var mcodes = [];
	var errors = [];
	
	_.each(lines,function(line,line_no){
		var result = that._parse(line);
		if(!result.ok) errors.push('['+line_no+'] '+result.msg);
		mcodes.push(result.mcode);
	});
	
	return {ok:errors.length==0,errors:errors,mcodes:mcodes};
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
	if(_.isUndefined(i)) return;				// The cpu will just step over any unrecognised instructions
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

var CPU = function(map,source) {
	this.map = map;
	if(!_.isUndefined(source))
		this.set(source);
	else {
		this.m = [];
		this._clear_registers();
		this.paused = false;
		this.modules = {};
		this.last_update = time.get_timestamp();
	}
	this.isa = isa;
}
CPU.prototype.set = function(source) {
	mapper.update(this.map,this,source);
	this.last_update = time.get_timestamp();
};

CPU.prototype.add_module = function(num,module) {
	this.modules[num] = module;
}

CPU.prototype._clear_registers = function() {
	this.r = [];
	for(var i=0;i<16;i++) {
		this.r[i] = 0;
	}
}
 
CPU.prototype.load = function(m,timestamp) {
	this.m = m;
	this._clear_registers();
	this.last_update = timestamp;
}
CPU.prototype.step = function(timestamp) {
	if(this.paused) return;
	var ip = this.r[0];
	if(ip>=this.m.length) return;

	var c = this.m[ip];
	this.isa.execute(this,c,timestamp);
	if(ip==this.r[0])
		this.r[0]++;
	this.last_update = timestamp;	
		
}

CPU.prototype.pause = function(timestamp) {
	this.paused = true;
	this.last_update = timestamp;	
}

CPU.prototype.un_pause = function(timestamp) {
	this.paused = false;
	this.last_update = timestamp;	
}



if(typeof module != 'undefined') {
    module.exports.ISA = ISA;
	module.exports.CPU = CPU;
} else {
}