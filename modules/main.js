var canvas;
var context;

var ship_fxs = [];
var my_ship_id = -1;
var my_ship;
var sync = function(f) {
	$.getJSON('/main/objects',function(data){
		my_ship_id = data.my_ship_id; 
		_.each(data.ships,function(ship) {
			if(ship.id == my_ship_id) {
				my_ship = ship;
				my_ship.v = 20;
				my_ship.t_x = 0;
				my_ship.t_y = 0;
			}
			ship.last_update = getTimestamp();		// Reset the timestamp to FE rather than BE
			
			var fx = _.find(ship_fxs,function(fx){
				return fx.ship.id==ship.id;
			});	
			
			if(_.isUndefined(fx))
				ship_fxs.push(new ShipFX(scene,ship,{color:'red',label:'starship x'}));
			else
				fx.ship = ship;
		});
		
		// TODO : Remove ships that has not been passed back
		
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
	
	
	_.each(ship_fxs,function(fx){
		update(fx.ship,time);
	});
	if(!_.isUndefined(my_ship)){
		$('#heading').html(rad2deg(my_ship.heading).toFixed(1));
		$('#velocity').html(my_ship.v.toFixed(1));
		$('#world_x').html(camera.center_x.toFixed(1));
		$('#world_y').html(camera.center_y.toFixed(1));
	}
	
}

var speed_up = false;
var slow_down = false;

var screen;
var camera;
var scene;

$(function() {
	canvas = $('#my_canvas')[0];
	canvas.onselectstart = function () { return false; }	// This stops the double click from selecting text on the page
	context = canvas.getContext('2d');

	screen = new Screen(canvas.width,canvas.height,context);
	camera = new Camera(149600000,0,0.007848062);	// Should reduce radius to 50
	scene = new Scene(screen,camera);

	var grid = new GridFX(scene,{color:'#303030',step:40});
	
	var sun = new PlanetFX(scene,{x:0,y:0,color:'yellow',radius:695500,label:'sun'});
	var mercury = new PlanetFX(scene,{x:57910000,y:0,color:'brown',radius:2440,label:'mercury',parent:sun});
	var venus = new PlanetFX(scene,{x:108200000,y:0,color:'white',radius:6052,label:'venus',parent:sun});
	var earth = new PlanetFX(scene,{x:149600000,y:0,color:'blue',radius:6371,label:'earth',parent:sun});
	var moon = new PlanetFX(scene,{x:384400,y:0,color:'gray',radius:1737,label:'moon',parent:earth});
	var mars = new PlanetFX(scene,{x:227900000,y:0,color:'red',radius:3396,label:'mars',parent:sun});
	var jupiter = new PlanetFX(scene,{x:778500000,y:0,color:'orange',radius:69911,label:'jupiter',parent:sun});
	var saturn = new PlanetFX(scene,{x:1443000000,y:0,color:'orange',radius:58232,label:'saturn',parent:sun});
	var uranus = new PlanetFX(scene,{x:2877000000,y:0,color:'blue',radius:25362,label:'uranus',parent:sun});
	var neptune = new PlanetFX(scene,{x:4503000000,y:0,color:'blue',radius:25362,label:'neptune',parent:sun});

	//var ship = new ShipFX(scene,{x:149600000,y:-8000,color:'white',radius:'2',label:'transport nx-001'})
	
	sync(function() {
		var av = 20;
		set_angular_velocity(my_ship,av,getTimestamp());
		$.post('/main/object/'+my_ship.id+'/set_angular_velocity',{p:{av:av}},function(data,textStatus,jqXHR){  
		});
	});
	setInterval(function() { sync(); },5000)
	sync();
	
	var animate = function() {
		var time = getTimestamp();
		keyboard.update();
		update_objects(time);
		render(time);
		setTimeout(animate, 0);
	}
	setTimeout(animate,110);

	
		
	keyboard.bind();
	keyboard.bind_key(keyboard.key_up,function(){ camera.translate(0,-1/camera.magnification); },function() { });
	keyboard.bind_key(keyboard.key_down,function(){ camera.translate(0,+1/camera.magnification); },function() { });	
	keyboard.bind_key(keyboard.key_left,function(){ camera.translate(-1/camera.magnification,0); },function() { });	
	keyboard.bind_key(keyboard.key_right,function(){ camera.translate(+1/camera.magnification,0); },function() { });	
	keyboard.bind_key(keyboard.key_plus,function(){ camera.magnification*=1.01; },function() { });	
	keyboard.bind_key(keyboard.key_minus,function(){ camera.magnification/=1.01; },function() { });	

	
	//keyboard.bind_key(keyboard.key_w,function(){ speed_up = true; },function() { speed_up = false; });	
	//keyboard.bind_key(keyboard.key_s,function(){ slow_down = true; },function() { slow_down = false; });	
	
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