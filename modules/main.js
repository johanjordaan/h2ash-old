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
			ship.last_update = getTimestamp();
		});
		
		if(!_.isUndefined(f))
			f();
	})
}

var drawObject = function(x,y,angle,color) {
	context.save();
	context.strokeStyle = color;
	
	context.beginPath();
	context.translate(x+world_x,-1*y+world_y);
	
	context.rotate(Math.PI/2 - angle);
	context.moveTo(0,0);
	context.lineTo(-10,0);
	context.lineTo(0,-30);
	context.lineTo(10,0);
	context.lineTo(0,0);
	context.closePath();
	context.stroke();
	context.restore();	
}

var clearCanvas = function() {
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);	
	drawGrid(world_x,world_y);
}

var drawGrid = function(world_x,world_y) {
	context.save();
	context.strokeStyle = '#505050';
	//context.setLineDash([3,6]); /// Not supported in IE
	
	var size = 100;
	var offset_x = world_x%size;
	var offset_y = world_y%size;
	
	
	
	for(var r=0;r<canvas.height;r+=size) {
		context.moveTo(0,r+offset_y);
		context.lineTo(canvas.width,r+offset_y);
	}
	
	for(var c=0;c<canvas.width;c+=size) {
		context.moveTo(c+offset_x,0);
		context.lineTo(c+offset_x,canvas.height);
	}

	//context.fillStyle = "#303030";
	//context.font = "20px Arial";
	//for(var r=0,rc=0;r<canvas.height;r+=size,rc++) {
	//	for(var c=0,cc=0;c<canvas.width;c+=size,cc++) {
	//		if(rc%5==0 && cc%5==0)
	//			context.fillText('('+c+','+r+')', c+offset_x, r+offset_y);
	//	}
	//}

	
	
	context.stroke();
	context.restore();
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
	clearCanvas();
	
	_.each(ships,function(ship){
		var color = 'red';
		if(ship.id == my_ship_id)
			color = 'green';
			
		drawObject(ship.p_x,ship.p_y,ship.heading,color);
	});
}

var update_objects = function(time) {
	if(scroll_up) world_y+=1;
	if(scroll_down) world_y-=1;
	if(scroll_left) world_x+=1;
	if(scroll_right) world_x-=1;
	
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
	if(!_.isUndefined(my_ship))
		$('#heading').html(rad2deg(my_ship.heading).toFixed(1));
		$('#velocity').html(my_ship.v.toFixed(1));
	
}

var world_x = 0;
var world_y = 0;
var scroll_up = false;
var scroll_down = false;
var scroll_left = false;
var scroll_right = false;
var speed_up = false;
var slow_down = false;

//function updateProgress(selector,percentage){
//    if(percentage > 100) percentage = 100;
//    $(selector).css('width', percentage+'%');
//    $(selector).html(percentage+'%');
//}

$(function() {
	canvas = $('#my_canvas')[0];
	canvas.onselectstart = function () { return false; }	// This stops the double click from selecting text on the page
	context = canvas.getContext('2d');
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
		set_target(my_ship,coords.x,-1*coords.y,getTimestamp());
		$.post('/main/object/'+my_ship.id+'/set_target',{p:{x:coords.x,y:-1*coords.y}},function(data,textStatus,jqXHR){  
		});
		return true;
	});
	
	$('#my_canvas').dblclick(function(e) {
		var coords = clickEventToElementCoordinates(this,e);
		
		
	}
	
});