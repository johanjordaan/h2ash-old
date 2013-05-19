var objects = [];
var canvas;
var context;

var deg2rad = function(deg) { return deg*(Math.PI/180.); }
var rad2deg = function(rad) { return rad*(180./Math.PI); }

var sync = function() {
	$.getJSON('/main/objects',function(data){
		//if(!_.isUndefined(objects[0]))
		//	$('#myTable > tbody:last').append('<tr><td>'+objects[0].px+','+objects[0].py+'--'+data[0].px+','+data[0].py+'</td></tr>');
		objects = data;
		_.each(objects,function(object) {
			object.last_update = getTimestamp();
		});
	})
}

var drawObject = function(x,y,angle) {
	context.save();
	context.strokeStyle = 'green';
	
	context.beginPath();
	context.translate(x,y);
	context.rotate(deg2rad(angle));
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
	
	_.each(objects,function(object){
		drawObject(object.px,object.py,object.heading);
	});
	
}

var update = function(time) {
	_.each(objects,function(object){
		update_movable_object(object,time);
	});
}

$(function() {
	canvas = $('#my_canvas')[0];
	context = canvas.getContext('2d');
	sync();
	
	
	var animate = function() {
		var time = getTimestamp();
        update(time);
        render(time);
        setTimeout(animate, 0);
	}
	setTimeout(animate,0);

	setInterval(function() { sync(); },5000)
	
	
	$('#my_canvas').click(function(e) {
		var coords = clickEventToElementCoordinates(this,e);
		objects[0].tx = coords.x;
		objects[0].ty = coords.y;
		//objects[0].v = 50;
		objects[0].last_update = getTimestamp();
		$.post('/main/object/1/set_target',{p:{x:coords.x,y:coords.y,v:0}},function(data,textStatus,jqXHR){  
			//objects = [data];
			//update_screen();
		});
	});
	
});