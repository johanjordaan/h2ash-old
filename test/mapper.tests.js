var assert = require('assert')
var should = require('chai').should()

var Mapper = require('../utils/mapper.js').Mapper;

// Test Domain Objects
//
var Person = function(name,email) {
    this.id = -1;
    this.name = name;
    this.email = email;
    this.accounts = [];
}
Person.prototype.print = function() {
	printf("%s (%s)\n",this.name,this.email);
}

var Account = function(type,bank) {
    this.id = -1;
	this.bank = bank;
    this.type = type;
}

var Bank = function(name) {
	this.id = -1;
	this.name = name;
}

// Test maps
//
var person_map = {
    model : Person,
    name : 'Person',
    fields : ['name','email'],
    refs : [{name:'accounts',map_name:'Account',type:'M',internal:true}]
};

var bank_map = {
	model : Bank,
	name : 'Bank',
	fields : ['name']
}

var account_map = {
    model : Account,
    name : 'Account',
    fields : ['type'],
	refs : [{name:'bank',map_name:'Bank',type:'S',internal:false}]
};


describe('Mapper', function() {
    describe('#constructor', function() {
        it('should create a mapper object that has the provided maps', function() {
			var mapper = new Mapper();
			Object.keys(mapper.maps).should.have.length(0);
			var mapper = new Mapper([person_map]);
			Object.keys(mapper.maps).should.have.length(1);
			assert(true,'Person' in mapper.maps);
        })
    })
})
