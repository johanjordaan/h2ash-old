if(typeof(require) == 'undefined') {
	trig = this;
} else {
	_ = require('underscore');
	trig = require('../utils/trig');
}

var constants = {
	AU:149597871,				// Astronomical Unit : Km
	sigma:5.670373e-8,			// Stefan-Boltzmann Konstant : W/(m^2*K^4)
	Ls_Sun:3.839e26,			// Luminosity of the Sun	
	WaterFreezingPoint:273.15,
	WaterBoilingPoint:373.15
}

var Genesis = function() {
}

Genesis.prototype._rnd_int = function(min,max) {
	return Math.floor(((max-min)*Math.random()))+min;
}  
Genesis.prototype._rnd = function(min,max) {
	return ((max-min)*Math.random())+min;
}  

Genesis.prototype.generate_star = function() {
	var Lse = this._rnd(0.1,100);			// 0.1 to 100 relative to the sun	
	var Ls = Lse * constants.Ls_Sun;		// L of earth mulitopled with the L relative to earth
	var Ts = this._rnd(3000,30000);	
	var Rs = Math.pow( Ls/(4*Math.PI*constants.sigma*Math.pow(Ts,4)),0.5)/1000;
	return {luminosity:Ls,temperature:Ts,radius:Rs};
}

Genesis.prototype.generate_planet = function() {
	var alpha = 0;
	var Ls = this.star.luminosity;
	
	var d = this._rnd(0.2,80) * constants.AU;
	var R = this._rnd(1000,500000);
	
	var Tp = Math.pow((Ls*(1-alpha)/(16*Math.PI*Math.pow(d*1000,2)*constants.sigma)),0.25);
	
	var habitable = Tp>=constants.WaterFreezingPoint && Tp<constants.WaterBoilingPoint;
	
	var moons = [];
	var num_moons = this._rnd_int(0,10);
	for(var mi=0;mi<num_moons;mi++) {
		moons.push(this.generate_moon(R));
	}
	
	return {distance:d,alpha:0,temperature:Tp,habitable:habitable,radius:R,moons:moons}
}

Genesis.prototype.generate_moon = function(parent_radius) {
	var d = this._rnd(100000,1000000);
	var R = this._rnd(parent_radius*.01,parent_radius*0.5);
	
	return {radius:R,distance:d};
}

Genesis.prototype.generate_solar_system = function() {
	this.star = this.generate_star();	
	var num_planets = this._rnd_int(0,20);		
	this.planets = [];
	for(var pi=0;pi<num_planets;pi++) {
		this.planets.push(this.generate_planet());
	}
} 


if(typeof module != 'undefined') {
	module.exports.Genesis = Genesis;
	module.exports.constants = constants;
} else {
}