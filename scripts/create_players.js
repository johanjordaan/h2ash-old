var _ = require('underscore');
var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;
var object_map = require('../maps/object_map.js').object_map;

var object = require('../utils/object.js');

var mapper = new Mapper();

var ship1 = object.create(100,-100,object.getTimestamp());
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

