var _ = require('underscore');
var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;
var object_map = require('../maps/object_map.js').object_map;

var object = require('../utils/object.js');

var mapper = new Mapper();


/////////////////
var PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;// Needs to be created
var NavigationModule = require('../models/navigation_module.js').NavigationModule;// Needs to be created
var CPU = require('../models/cpu.js').CPU;	
var Ship = require('../models/ship.js').Ship; // Needs to be created

var propulsion_module_map = require('../maps/propulsion_module_map.js').propulsion_module_map;// Needs to be created
var navigation_module_map = require('../maps/navigation_module_map.js').navigation_module_map;// Needs to be created
var cpu_map = require('../maps/cpu_map.js').cpu_map;
var ship_map = require('../maps/ship_map.js').ship_map;// Needs to be created

var propulsion_module = new PropulsionModule(propulsion_module_map,{max_speed:50,latency:1000});
var navigation_module = new NavigationModule(navigation_module_map,{latency:1000});
var cpu = new CPU(cpu_map,{memory:1000,tpi:500,max_modules:2});
cpu.add_module(0,propulsion);
cpu.add_module(1,navigation);
var ship = new Ship(ship_map,{x:149600000.0,y:8000,name:'nx-01',cpu:cpu,propulsion:propulsion_module,navigation:navigation_module});
/////////////////




var ship1 = object.create(149600000.0,8000,object.getTimestamp());
ship1.id = 1;
var ship2 = object.create(300,-100,object.getTimestamp());
ship2.id = 2;


var players = [
	{email:'Johan',user_name:'Johan',password:'123',ship:ship1},
	{email:'Lorraine',user_name:'Lorraine',password:'321',ship:ship2},
];

// Maybee later used for password hashing
//var crypto = require('crypto');
//_.each(players,function(player) {
//	var hash = crypto.createHash('sha512');
//	hash.update(player.password);
//	player.password = hash.digest('hex');
//});

mapper.save_all(player_map,players,function(players){
	mapper.quit();
}); 

