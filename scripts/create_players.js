var _ = require('underscore');
var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;
var object_map = require('../maps/object_map.js').object_map;

var object = require('../utils/object.js');

var mapper = new Mapper();



/////////////////
var PropulsionModuleType = require('../models/propulsion_module_type.js').PropulsionModuleType;
var PropulsionModule = require('../models/propulsion_module.js').PropulsionModule;
var NavigationModuleType = require('../models/navigation_module_type.js').NavigationModuleType;
var NavigationModule = require('../models/navigation_module.js').NavigationModule;
var CPU = require('../models/cpu.js').CPU;	
var ShipType = require('../models/ship_type.js').ShipType; 
var Ship = require('../models/ship.js').Ship; 

var propulsion_module_type_map = require('../maps/propulsion_module_type_map.js').propulsion_module_type_map;
var propulsion_module_map = require('../maps/propulsion_module_map.js').propulsion_module_map;
var navigation_module_type_map = require('../maps/navigation_module_type_map.js').navigation_module_type_map;
var navigation_module_map = require('../maps/navigation_module_map.js').navigation_module_map;
var cpu_map = require('../maps/cpu_map.js').cpu_map;
var ship_type_map = require('../maps/ship_type_map.js').ship_type_map;
var ship_map = require('../maps/ship_map.js').ship_map;

var propulsion_module_type = new PropulsionModuleType(propulsion_module_type_map,{name:'Plasma Engine I',max_speed:50,latency:1000});
var propulsion_module = new PropulsionModule(propulsion_module_map,{type:propulsion_module_type});
var navigation_module_type = new NavigationModuleType(navigation_module_type_map,{name:'Mapper 1000',latency:1000});
var navigation_module = new NavigationModule(navigation_module_map,{type:navigation_module_type});
var cpu = new CPU(cpu_map);
cpu.add_module(0,propulsion_module);
cpu.add_module(1,navigation_module);
var ship_type = new ShipType(ship_type_map,{name:'Explorer Class I'})
var ship1 = new Ship(ship_map,{
	type : ship_type,
	mechanical_object : {
		x:149600000.0,
		y:8000
	},	
	cpus:[cpu],
	propulsion_modules:[propulsion_module],
	navigation_modules:[navigation_module],
});
var ship2 = new Ship(ship_map,{
	type : ship_type,
	mechanical_object : {
		x:149600000.0,
		y:20000
	},	
	cpus:[cpu],
	propulsion_modules:[propulsion_module],
	navigation_modules:[navigation_module],
});
/////////////////



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

