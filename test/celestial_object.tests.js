var _ = require('underscore');
var assert = require('assert')
var should = require('chai').should();
var expect = require('chai').expect;

var trig = require('../utils/trig.js');

var CelestialObject = require('../models/celestial_object.js').CelestialObject;
var celestial_object_map = require('../maps/celestial_object_map.js').celestial_object_map;

describe('CelestialObject',function(){
	describe('#constructor',function() {
		it('should create a new celestial object base on the map and the source',function() {
			var source = {radius:1000}
			var celestial_object = new CelestialObject(celestial_object_map,source);
			celestial_object.map.should.equal(celestial_object_map);
			celestial_object.radius.should.equal(source.radius);
			expect(celestial_object.name).to.be.undefined;
		});
	});
	describe('#set',function() {
		it('should set the values of the celstial object base on the source',function(){
			var initial_source = {radius:1000,name:'moon'}
			var source = {radius:200}
			var celestial_object = new CelestialObject(celestial_object_map,initial_source);
			celestial_object.set(source);
			
			celestial_object.radius.should.equal(source.radius);
			celestial_object.name.should.equal(initial_source.name);
		});
	});
	describe('#update',function() {
		it('should update update the position of the celestial object based on (speed(+),time etc)',function(){
			var source = {radius:1000,orbital_raddius:1000000,orbital_position:0,orbital_speed:trig.deg2rad(10),x:0,y:0,last_update:0};
			var celestial_object = new CelestialObject(celestial_object_map,source);
			
			celestial_object.update(1000);
			
			celestial_object.orbital_position.should.equal(trig.deg2rad(10));
		});
		it('should update update the position of the celestial object based on (speed(-),time etc)',function(){
			var source = {radius:1000,orbital_raddius:1000000,orbital_position:0,orbital_speed:trig.deg2rad(-10),x:0,y:0,last_update:0};
			var celestial_object = new CelestialObject(celestial_object_map,source);
			
			celestial_object.update(1000);
			
			celestial_object.orbital_position.should.equal(trig.deg2rad(-10));
		});

	});
});
