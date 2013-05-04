var assert = require('assert')
var should = require('chai').should()

var Mapper = require('../utils/mapper.js').Mapper;

// Test Domain Objects
//
var Person = function(name,email) {
    this.name = name;
    this.email = email;
    this.accounts = [];
}
Person.prototype.print = function() {
	printf("%s (%s)\n",this.name,this.email);
}

var Account = function(type,bank) {
	this.bank = bank;
    this.type = type;
}

var Bank = function(name) {
	this.name = name;
}

// Test maps
//
/*var person_map = {
    model : Person,
    name : 'Person',
    fields : ['name','email'],
    refs : [{name:'accounts',map_name:'Account',type:'M',internal:true}]
};*/
// Field : type - List for list of objects
//                Simple for simple fields - Default (Should later be things like int/string etc to type check)
//                Ref for ref to another object
//         default_value - value to to be created with if not specified in constructor
//         map_name - name of map to use for list and ref types  
//         internal - for list and refs it specifies wheter new objects are created or not
var person_map = {
    model	: Person,
    name 	: 'Person',
    fields 	: {
		name 	 : { type:'Simple', default_value:'*name*' },
		email 	 : { type:'Simple', default_value:'*email*' },
		accounts : { type:'List', map_name : 'Account', internal : true}
	},
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


// Need a test for duplicate named mape
//
describe('Mapper', function() {
    describe('#constructor', function() {
        it('should create a mapper object that has the provided maps', function() {
			var mapper = new Mapper();
			Object.keys(mapper.maps).should.have.length(0);
			var mapper = new Mapper([person_map]);
			Object.keys(mapper.maps).should.have.length(1);
			assert(true,'Person' in mapper.maps);
			var mapper = new Mapper([person_map,bank_map,account_map]);
			Object.keys(mapper.maps).should.have.length(3);
			mapper.maps.should.have.property(person_map.name);
			mapper.maps.should.have.property(bank_map.name);
			mapper.maps.should.have.property(account_map.name);
        });
    });
	describe('#create',function() {
		it('should create an instance of the class based the map fields and defaults', function() {
			var mapper = new Mapper([person_map,bank_map,account_map]);
			var p = mapper.create('Person');
			p.id.should.equal(-1);
			p.name.should.equal(person_map.fields.name.default_value);
			p.email.should.equal(person_map.fields.email.default_value);
			p.accounts.should.be.a('Array');
			p.accounts.should.have.length(0);
		});
		it('should create an instance of the class based the map fields and defaults and the initial values', function() {
			var mapper = new Mapper([person_map,bank_map,account_map]);
			var initial_values = {email:'me@here.com'}				;
			var p = mapper.create('Person',initial_values);
			p.id.should.equal(-1);
			p.name.should.equal(person_map.fields.name.default_value);
			p.email.should.equal(initial_values.email);
			p.accounts.should.be.a('Array');
			p.accounts.should.have.length(0);
		});

	});
})
