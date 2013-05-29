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

/*
var createPing = function(x,y) {
	return {
		p_x:x,
		p_y:y,
		step_size:3,
		max_steps:100,
		current_step:3,
		gradients : ['gray','white','red']
	};
}


var pings = [];

var drawPing = function(ping) {
	context.save();
	
	context.translate(ping.p_x+world_x,-1*ping.p_y+world_y);
	
	
	_.each(ping.gradients,function(gradient,index) {
		context.beginPath();	
		context.strokeStyle = gradient;
		context.arc(0,0,(ping.step_size)*ping.current_step-(ping.step_size*(3-index)),0,2*Math.PI,false);
		context.stroke();
	});
	
	
	context.restore();	
}*/

var celestials = [
	{p_x:0,p_y:0,color:'yellow',label:'sun'},
]

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
	wc.clear();
	wc.draw_grid(40);
	
	_.each(ships,function(ship){
		if(ship.id == my_ship_id)
			wc.draw_object(ship.p_x,ship.p_y,2,'My Ship','green');
		else
			wc.draw_object(ship.p_x,ship.p_y,2,'Some Other Ship','red');
		
		
		//drawObject(ship.p_x,ship.p_y,ship.heading,color,'This is the ship name ...');
	});
	
	_.each(celestials,function(celestial){
		wc.draw_object(celestial.p_x,celestial.p_y,100,'Sun','yellow');
		//drawCelestial(celestial.p_x,celestial.p_y);
	});
	
	/*var hitlist = [];
	_.each(pings,function(ping,index){
		if(ping.current_step<ping.max_steps) {
			ping.current_step += ping.step_size;
			drawPing(ping);
		} else {
			hitlist.push(index);	
		}
	});
	_.each(hitlist,function(target){
		pings.splice(target,1);
	});*/
	
	
}

var update_objects = function(time) {
	if(scroll_up) wc.translate(0,1);
	if(scroll_down)  wc.translate(0,-1);
	if(scroll_left) wc.translate(1,0);
	if(scroll_right) wc.translate(-1,0);
	
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
		$('#world_x').html(wc.world_x.toFixed(1));
		$('#world_y').html(wc.world_y.toFixed(1));
	}
	
}

var scroll_up = false;
var scroll_down = false;
var scroll_left = false;
var scroll_right = false;
var speed_up = false;
var slow_down = false;

var wc;
//function updateProgress(selector,percentage){
//    if(percentage > 100) percentage = 100;
//    $(selector).css('width', percentage+'%');
//    $(selector).html(percentage+'%');
//}

$(function() {
	canvas = $('#my_canvas')[0];
	canvas.onselectstart = function () { return false; }	// This stops the double click from selecting text on the page
	context = canvas.getContext('2d');
	
	wc = new WorldCanvas(canvas.width,canvas.height,context); 
	wc.translate(73,244);
	
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
	keyboard.bind(key_up,function(){ scroll_up = true; },function() { scroll_up = false; });
	keyboard.bind(key_down,function(){ scroll_down = true; },function() { scroll_down = false; });	
	keyboard.bind(key_left,function(){ scroll_left = true; },function() { scroll_left = false; });	
	keyboard.bind(key_right,function(){ scroll_right = true; },function() { scroll_right = false; });	
	keyboard.bind(key_w,function(){ speed_up = true; },function() { speed_up = false; });	
	keyboard.bind(key_s,function(){ slow_down = true; },function() { slow_down = false; });	
	
	
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

		set_target(my_ship,coords.x-wc.world_x,-1*(coords.y - wc.world_y),getTimestamp());
		console.log(coords);
		
		$.post('/main/object/'+my_ship.id+'/set_target',{p:{x:coords.x-wc.world_x,y:-1*(coords.y-wc.world_y)}},function(data,textStatus,jqXHR){  
		});
		return true;
	});
	
	$('#my_canvas').dblclick(function(e) {
		var coords = clickEventToElementCoordinates(this,e);
		
		
	});
	
});