var assert = require('assert');
var should = require('chai').should();

var redis = require('redis');
var q = require('q');

var printf = require('../utils/printf.js').printf
var Mapper = require('../utils/mapper.js').Mapper;


// Test Domain Objects
//
var Person = function(name,email) {
    this.name = name;
    this.email = email;
    this.accounts = [];
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
	}
};

var bank_map = {
	model 	: Bank,
	name 	: 'Bank',
	fields 	: {
		name 	 : { type:'Simple', default_value:'*name*' }
	}
}

var account_map = {
    model 	: Account,
    name 	: 'Account',
	fields	: {
		type 	: { type:'Simple', default_value:'*type*' },
		bank	: { type:'Ref', map_name:'Bank', internal:false }
	}
};


var debug_db = 15;

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
	describe('#save/#load',function() {
		beforeEach(function(done) { 
			var client = redis.createClient();
			client.select(debug_db);
			client.FLUSHDB(function() { 
				client.quit();
				done(); 
			});
		});
		
		it('should save/load a simple object (no list or refs fields)',function(done) {
			var mapper = new Mapper([person_map,bank_map,account_map],debug_db);
			var initial_data = {name:'The Best Bank'};
			var b = mapper.create('Bank',initial_data);
			mapper.save(b).then(function(saved_bank){
				saved_bank.id.should.equal(1);
				return mapper.load('Bank',1);
			}).then(function(loaded_bank){
				loaded_bank.id.should.equal(1);
				loaded_bank.name.should.equal(initial_data.name);
			}).done(done);
		});
		
		it('should save/load a object with a ref (external) field',function(done) {
			var mapper = new Mapper([person_map,bank_map,account_map],debug_db);
			var bank_initial_data = {name:'The Best Bank'};
			var account_initial_data = {type:'Savings Account'};
						
			var b = mapper.create('Bank',bank_initial_data);
			var a = mapper.create('Account',account_initial_data);

			mapper.save(b).then(function(saved_bank){
				b.id.should.equal(1);
				a.bank = b;
				return mapper.save(a);
			}).then(function() {
				return mapper.load('Account',1);
			}).then(function(loaded_account){
				loaded_account.id.should.equal(1);
				loaded_account.type.should.equal(account_initial_data.type);
				loaded_account.bank.id.should.equal('1');
				loaded_account.bank.name.should.equal(bank_initial_data.name);
			}).done(done);
		});

	});

})
