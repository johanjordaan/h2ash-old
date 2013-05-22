var _ = require('underscore');
var Mapper = require('../utils/mapper.js').Mapper;
var player_map = require('../maps/player_map.js').player_map;
var crypto = require('crypto');


var mapper = new Mapper();

var players = [
	mapper.create(player_map,{email:'djjordaan@gmail.com',user_name:'Johan',password:'123'}),
	mapper.create(player_map,{email:'lorraine.evert@gmail.com',user_name:'Lorraine',password:'321'}),
];

// Maybee later used for password hashing
//_.each(players,function(player) {
//	var hash = crypto.createHash('sha512');
//	hash.update(player.password);
//	player.password = hash.digest('hex');
//});

mapper.save_all(player_map,players,function(players){
	mapper.quit();
}); 

