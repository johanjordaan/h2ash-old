var assert = require('assert');
var should = require('chai').should();
var expect = require('chai').expect;


var redis = require('redis');
var q = require('q');

var printf = require('../utils/printf.js').printf
var Mapper = require('../utils/mapper.js').Mapper;


// Test Domain Objects
//
var Person = function(name,surname,age,contact_details) {
    this.name = name;
	this.surname = surname;
	this.age = age;	
	this.contact_details = contact_details;
	this.extra_contact_details = contact_details;
    this.accounts = [];
}

var Account = function(type,bank) {
	this.bank = bank;
    this.type = type;
}

var Bank = function(name) {
	this.name = name;
	this.constructor_name = name;		// This value will not be set if the constructor was called with no parameters
}

var ContactDetails = function(cel_no,tek_no,email) {
	this.cel_no = cel_no;
	this.tel_no = tek_no;
	this.email = email;
}

// Test maps
//
// Field : type - List for list of objects
//                Simple for simple fields - Default (Should later be things like int/string etc to type check)
//                Ref for ref to another object
//         default_value - value to to be created with if not specified in constructor
//         map_name - name of map to use for list and ref types  
//         internal - for list and refs it specifies wheter new objects are created or not
//
// NOTE : To ref a map it must be defined before reffing. This also forces you to think about recoursive definitions

var bank_map = {
	model 		: Bank,
	model_name	: 'Bank',		
	fields 	: {
		name 	 : { type:'Simple', default_value:'*name*' }
	},
	default_collection : 'Banks'
}

var contact_details_map = {
	model 		: ContactDetails,
	model_name	: 'ContactDetails',		
	fields 	: {
		cel_no 	 : { type:'Simple', default_value:'*cel_no*' },
		tel_no 	 : { type:'Simple', default_value:'*tel_no*' },
		email 	 : { type:'Simple', default_value:'*email*' }
	},
}

var bank_map_with_constructor = {
	model 		: Bank,
	model_name	: 'Bank',
	fields 	: {
		name 	 : { type:'Simple', default_value:'*name*' }
	},
	constructor_args : ['name'],
	default_collection : 'Banks'
}

var account_map = {
	model 		: Account,
	model_name	: 'Account',	
	fields	: {
		type 	: { type:'Simple', default_value:'*type*' },
		bank	: { type:'Ref', map:bank_map, internal:false }
	},
	default_collection : 'Accounts'
};

var person_map = {
	model		: Person,
    model_name 	: 'Person',
    fields 	: {
		name 	 		: { type:'Simple', default_value:'*name*' },
		surname	 		: { type:'Simple', default_value:'*surname*' },
		age		 		: { type:'Simple', default_value:10,conversion:Number },
		contact_details	: { type:'Ref', map:contact_details_map, internal:true },
		extra_contact_details	: { type:'Ref', map:contact_details_map, internal:true },
		accounts 		: { type:'List', map : account_map, internal : true}
	},
	default_collection : 'People'
};



var debug_db = 15;

describe('Mapper', function() {
    describe('#constructor', function() {
        it('should create a mapper that uses the specified db', function() {
			var mapper = new Mapper(1);
			mapper.db_id.should.equal(1);
			var mapper = new Mapper(15);
			mapper.db_id.should.equal(15);
        });
    });
	describe('#create',function() {
		it('should create an instance of the class based the map fields and defaults', function() {
			var mapper = new Mapper();
			var p = mapper.create(person_map);
			p.id.should.equal(-1);
			p.name.should.equal(person_map.fields.name.default_value);
			p.surname.should.equal(person_map.fields.surname.default_value);
			p.contact_details.should.be.a('object');
			p.contact_details.cel_no.should.equal(contact_details_map.fields.cel_no.default_value);
			p.contact_details.tel_no.should.equal(contact_details_map.fields.tel_no.default_value);
			p.contact_details.email.should.equal(contact_details_map.fields.email.default_value);
			p.accounts.should.be.a('Array');
			p.accounts.should.have.length(0);
		});
		it('should create an instance of the class based the map fields and defaults and the initial values', function() {
			var mapper = new Mapper();
			var initial_values = {surname:'jordaan'}				;
			var p = mapper.create(person_map,initial_values);
			p.id.should.equal(-1);
			p.name.should.equal(person_map.fields.name.default_value);
			p.surname.should.equal(initial_values.surname);
			p.accounts.should.be.a('Array');
			p.accounts.should.have.length(0);
		});
		it('should create a new object by using the constructor with the given parameters',function() {
			var mapper = new Mapper();
			var initial_values = {name:'Construction Bank'};
			var b = mapper.create(bank_map_with_constructor,initial_values);
			b.name.should.equal(initial_values.name);
			b.constructor_name.should.equal(initial_values.name);
		});
	});
	describe('#_all',function() {
		it('should list the unsaved objects in the tree',function() {
			var mapper = new Mapper(debug_db);
			var p = mapper.create(person_map);
			var us = mapper._all(p);
			us.length.should.equal(3);
			var b = mapper.create(bank_map);
			var a = mapper.create(account_map,{bank:b});
			p.accounts.push(a);
			var us = mapper._all(p);
			us.length.should.equal(5);
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
		it('xxx',function(done) {
			var mapper = new Mapper(debug_db);
			var p = mapper.create(person_map);
			var b = mapper.create(bank_map);
			var a = mapper.create(account_map,{bank:b});
			p.accounts.push(a);
			p.name = 'Johan';
			mapper.save(p,function(saved_person) { 
				saved_person.name.should.equal('Johan');
				mapper.load(person_map,1,function(loaded_person){
					loaded_person.name.should.equal('Johan');
					done();
				});
			});
		});
		it('should save/load a simple object (no list or refs fields)',function(done) {
			var mapper = new Mapper(debug_db);
			var initial_data = {name:'The Best Bank'};
			var b = mapper.create(bank_map,initial_data);
			mapper.save(b,function(saved_bank){
				saved_bank.id.should.equal(1);
				mapper.load(bank_map,1,function(loaded_bank){
					loaded_bank.id.should.equal(1);
					loaded_bank.name.should.equal(initial_data.name);
					done();
				});
			})
		});


		/*
		it('should save a ref to any new objects to the collection specified in the map XXX',function(done) {
			var mapper = new Mapper(debug_db);
			var initial_data_1 = {name:'The Best Bank'};
			var initial_data_2 = {name:'The Worst Bank'};
			var b1 = mapper.create(bank_map,initial_data_1);
			var b2 = mapper.create(bank_map,initial_data_2);
			
			q.all([mapper.save(b1),mapper.save(b2)]).then(function(saved_banks) {
				saved_banks.length.should.equal(2);
				return mapper.load_all(bank_map);
			}).then(function(loaded_banks) {
				loaded_banks.length.should.equal(2);
			}).done(done);
		});
		*/

		it('should save/load a object with a ref (external) field',function(done) {
			var mapper = new Mapper(debug_db);
			var bank_initial_data = {name:'The Best Bank'};
			var account_initial_data = {type:'Savings Account'};
						
			var b = mapper.create(bank_map,bank_initial_data);
			var a = mapper.create(account_map,account_initial_data);

			mapper.save(b,function(saved_bank){
				b.id.should.equal(1);
				a.bank = b;
				mapper.save(a,function(saved_account) {
					mapper.load(account_map,1,function(loaded_account){
						loaded_account.id.should.equal(1);
						loaded_account.type.should.equal(account_initial_data.type);
						loaded_account.bank.id.should.equal(1);
						loaded_account.bank.name.should.equal(bank_initial_data.name);
						done();
					});
				});
			})
		});

		it('should save/load a object with a list field',function(done) {
			var mapper = new Mapper(debug_db);
			var bank_initial_data = {name:'The Best Bank'};
			var sa_account_initial_data = {type:'Savings Account'};
			var cc_account_initial_data = {type:'Credit Card'};
			var person_initial_data = {name:'johan',surname:'jordaan'};			
						
			var b = mapper.create(bank_map,bank_initial_data);
			var sa = mapper.create(account_map,sa_account_initial_data);
			var cc = mapper.create(account_map,cc_account_initial_data);
			var p = mapper.create(person_map,person_initial_data);
			
			mapper.save(b,function(saved_bank){
				b.id.should.equal(1);
				sa.bank = b;
				cc.bank = b;
				p.accounts.push(sa);
				p.accounts.push(cc);
				mapper.save(p,function() {
					mapper.load(person_map,1,function(loaded_person){
						loaded_person.id.should.equal(1);
						loaded_person.name.should.equal(person_initial_data.name);
						loaded_person.surname.should.equal(person_initial_data.surname);
						loaded_person.accounts.should.have.length(2);
						// Misiing some checks ?
						done();
					});
				});
			})
		});
		
		
		/*
		it('should load an object and call the constructor if constructor args are specified',function(done) {
			var mapper = new Mapper(debug_db);
			var bank_initial_data = {name:'The Best Bank'};
			var b = mapper.create(bank_map_with_constructor,bank_initial_data);
			
			mapper.save(b,function(saved_bank){
				b.id.should.equal(1);
				b.name.should.equal(bank_initial_data.name);
				mapper.load(bank_map_with_constructor,1,function(loaded_bank){
					loaded_bank.id.should.equal(1);
					loaded_bank.name.should.equal(bank_initial_data.name);
					loaded_bank.constructor_name.should.equal(bank_initial_data.name);
					done();
				});
			})
		});
		*/

		/*
		it('should save all internal ref fields as their own objects',function(done) {
			var mapper = new Mapper(debug_db);
			var p = mapper.create(person_map);
			mapper.save(p).then(function(saved_person) {
				p.contact_details.id.should.not.equal(p.extra_contact_details.id);
				return mapper.load(person_map,1);
			}).then(function(loaded_person){
				loaded_person.contact_details.id.should.not.equal(loaded_person.extra_contact_details.id);
				loaded_person.contact_details.email.should.equal(contact_details_map.fields.email.default_value);
			}).done(done);
		});
		*/
		
		it('should throw an exception if id or map is not provided',function() {
			var mapper = new Mapper(debug_db);
			var fn = function() { mapper.load(); }
			expect(fn).to.throw("Map not provided for load.");
			var fn2 = function() { mapper.load(person_map); }
			expect(fn2).to.throw("ID not provided for load.");
		});

		
		it('should use the conversion function when specified on loading',function(done) {
			var mapper = new Mapper(debug_db);
			var p = mapper.create(person_map);
			p.age = 22;
			mapper.save(p,function(saved_person) {
				p.contact_details.id.should.not.equal(p.extra_contact_details.id);
				mapper.load(person_map,1,function(loaded_person){
					loaded_person.contact_details.id.should.not.equal(loaded_person.extra_contact_details.id);
					loaded_person.contact_details.email.should.equal(contact_details_map.fields.email.default_value);
					loaded_person.age.should.be.equal(22);
					done();
				});
			});
		});
	});
})
