var ships = [];
var my_ship_id = -1;
var my_ship;
var canvas;
var context;

var sync = function(f) {
	$.getJSON('/main/objects',function(data){
		//if(!_.isUndefined(objects[0]))
		//	$('#myTable > tbody:last').append('<tr><td>'+objects[0].px+','+objects[0].py+'--'+data[0].px+','+data[0].py+'</td></tr>');
		//{my_ship_id:player.ship.id,ships:objects}
		my_ship_id = data.my_ship_id; 
		ships = data.ships;
		_.each(ships,function(ship) {
			if(ship.id == my_ship_id)
				my_ship = ship;
			ship.last_update = getTimestamp();		// Reset the timestamp to FE rather than BE
		});
		
		if(!_.isUndefined(f))
			f();
	})
}

var clickEventToElementCoordinates = function(element,event) {
	var offsetX = 0, offsetY = 0
	if (element.offsetParent) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}
	
	return {x:event.pageX-offsetX,y:event.pageY-offsetY};
}

var render = function(time) {
	screen.clear();
	scene.render();
}

var update_objects = function(time) {
	var delta = 1/camera.magnification;
	if(scroll_up) camera.translate(0,-delta);
	if(scroll_down)  camera.translate(0,+delta);
	if(scroll_left) camera.translate(-delta,0);
	if(scroll_right) camera.translate(+delta,0);
	
	if(zoom_in) camera.magnification*=1.01;
	if(zoom_out) camera.magnification/=1.01;
	
	
	
	var v = my_ship.v;
	if(speed_up) {
		if(v<40) v++;
	} else if(slow_down) {
		if(v>0) v--;
	}
	
	if(v != my_ship.v) {
		set_velocity(my_ship,v,getTimestamp());
		$.post('/main/object/'+my_ship.id+'/set_velocity',{p:{v:v}},function(data,textStatus,jqXHR){  
		});
	}
	
	
	_.each(ships,function(ship){
		update(ship,time);
	});
	if(!_.isUndefined(my_ship)){
		$('#heading').html(rad2deg(my_ship.heading).toFixed(1));
		$('#velocity').html(my_ship.v.toFixed(1));
		$('#world_x').html(camera.center_x.toFixed(1));
		$('#world_y').html(camera.center_y.toFixed(1));
	}
	
}

var scroll_up = false;
var scroll_down = false;
var scroll_left = false;
var scroll_right = false;
var speed_up = false;
var slow_down = false;
var zoom_in = false;
var zoom_out = false;

var screen;
var camera;
var scene;


//function updateProgress(selector,percentage){
//    if(percentage > 100) percentage = 100;
//    $(selector).css('width', percentage+'%');
//    $(selector).html(percentage+'%');
//}

$(function() {
	canvas = $('#my_canvas')[0];
	canvas.onselectstart = function () { return false; }	// This stops the double click from selecting text on the page
	context = canvas.getContext('2d');

	screen = new Screen(canvas.width,canvas.height,context);
	camera = new Camera(149600000,0,0.007848062);	// Should reduce radius to 50
	scene = new Scene(screen,camera);

	var grid = new GridFX(scene,{color:'#303030',step:40});
	
	var sun = new PlanetFX(scene,{x:0,y:0,color:'yellow',radius:695500,label:'sun'});
	var mercury = new PlanetFX(scene,{x:57910000,y:0,color:'brown',radius:2440,label:'mercury'});
	var venus = new PlanetFX(scene,{x:108200000,y:0,color:'white',radius:6052,label:'venus'});
	var earth = new PlanetFX(scene,{x:149600000,y:0,color:'blue',radius:6371,label:'earth'});
	var moon = new PlanetFX(scene,{x:149600000+384400,y:0,color:'gray',radius:1737,label:'moon',parent:earth});
	var mars = new PlanetFX(scene,{x:227900000,y:0,color:'red',radius:3396,label:'mars'});
	var jupiter = new PlanetFX(scene,{x:778500000,y:0,color:'orange',radius:69911,label:'jupiter'});
	var saturn = new PlanetFX(scene,{x:1443000000,y:0,color:'orange',radius:58232,label:'saturn'});
	var uranus = new PlanetFX(scene,{x:2877000000,y:0,color:'blue',radius:25362,label:'uranus'});
	var neptune = new PlanetFX(scene,{x:4503000000,y:0,color:'blue',radius:25362,label:'neptune'});

	sync(function() {
		var av = 20;
		set_angular_velocity(my_ship,av,getTimestamp());
		$.post('/main/object/'+my_ship.id+'/set_angular_velocity',{p:{av:av}},function(data,textStatus,jqXHR){  
		});
		
		var animate = function() {
			var time = getTimestamp();
			update_objects(time);
			render(time);
			setTimeout(animate, 0);
		}
		setTimeout(animate,0);
	});

	setInterval(function() { sync(); },5000)
		
	var keyboard = {
		bindings : {},
	
		bind : function(key,down,up) {
			this.bindings[key] = {up:up,down:down}
		},
		log_event : function(type,e) {
			if(_.has(this.bindings,e.keyCode))
				this.bindings[e.keyCode][type]();
		}
	}	

	// 38 up ,40 down, 37 left, 39 right
	var key_up = 38;
	var key_down = 40;
	var key_left = 37;
	var key_right = 39;
	var key_w = 87;
	var key_s = 83;
	var key_plus = 187;
	var key_minus = 189;
	keyboard.bind(key_up,function(){ scroll_up = true; },function() { scroll_up = false; });
	keyboard.bind(key_down,function(){ scroll_down = true; },function() { scroll_down = false; });	
	keyboard.bind(key_left,function(){ scroll_left = true; },function() { scroll_left = false; });	
	keyboard.bind(key_right,function(){ scroll_right = true; },function() { scroll_right = false; });	
	keyboard.bind(key_w,function(){ speed_up = true; },function() { speed_up = false; });	
	keyboard.bind(key_s,function(){ slow_down = true; },function() { slow_down = false; });	
	keyboard.bind(key_w,function(){ speed_up = true; },function() { speed_up = false; });	
	keyboard.bind(key_plus,function(){ zoom_in = true; },function() { zoom_in = false; });	
	keyboard.bind(key_minus,function(){ zoom_out = true; },function() { zoom_out = false; });	
	
	
	$(document).keyup(function(e) {
		keyboard.log_event('up',e);
		return false;
	});
	
	$(document).keydown(function(e) {
		keyboard.log_event('down',e);
		return false;
	});
	
	$('#my_canvas').dblclick(function(e) {
		var coords = clickEventToElementCoordinates(this,e);
		//pings.push(createPing(coords.x-world_x,-1*(coords.y - world_y)));

		//set_target(my_ship,coords.x-wc.world_x,-1*(coords.y - wc.world_y),getTimestamp());
		console.log(coords);
		
		//$.post('/main/object/'+my_ship.id+'/set_target',{p:{x:coords.x-wc.world_x,y:-1*(coords.y-wc.world_y)}},function(data,textStatus,jqXHR){  
		//});
		return true;
	});
	
	$('#my_canvas').dblclick(function(e) {
		var coords = clickEventToElementCoordinates(this,e);
		
		
	});

	var socket = io.connect('http://imp:3000/');
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('my other event', { my: 'data' });
	});

	
});