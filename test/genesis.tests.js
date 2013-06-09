var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var Mock = require('../utils/mock.js').Mock;

var constants = require('../utils/genesis.js').constants;
var Genesis = require('../utils/genesis.js').Genesis;


describe('genesis',function(){
	describe('#generate_solar_system',function(){
		it('should create a simple solar system (Sun/Earth/Moon)',function() {
			var genesis = new Genesis();
			var mock = new Mock(genesis);
			
			mock.expect('_rnd',[0.1,100],function(){	return 1; }); 			// Luminosity relative to Sun
			mock.expect('_rnd',[3000,30000],function(){	return 5778; });		// Temperature in K
			mock.expect('_rnd_int',[0,20],function(){ return 1; });				// Number of planets
			mock.expect('_rnd',[0.2,80],function(){ return 1; });				// Orbital Distance AU
			mock.expect('_rnd',[1000,500000],function(){ return 6378; });		// Radius range for planets
			mock.expect('_rnd_int',[0,10],function(){ return 1; });				// Number of moons
			mock.expect('_rnd',[100000,1000000],function(){ return 384400; });	// Orbital Diatnace from parent Km
			mock.expect('_rnd',[63.78,6378/2],function(){ return 1737; });		// Radius Range of moon
			
			genesis.generate_solar_system();
			genesis.star.luminosity.should.equal(3.839e26);
			genesis.star.temperature.should.equal(5778);
			Math.floor(genesis.star.radius).should.equal(695253); //695500 in books but im happy with this close value  
			genesis.planets.length.should.equal(1);
			genesis.planets[0].distance.should.equal(constants.AU);
			Math.floor(genesis.planets[0].temperature).should.equal(278);
			genesis.planets[0].habitable.should.equal(true);
			genesis.planets[0].radius.should.equal(6378);
			genesis.planets[0].moons.length.should.equal(1);
			genesis.planets[0].moons[0].distance.should.equal(384400);
			genesis.planets[0].moons[0].radius.should.equal(1737);
						
		
			mock.validate(true).status.should.equal('ok');
			
		});
	});
});