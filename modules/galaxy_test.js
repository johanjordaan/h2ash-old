var canvas;
var context;

var screen;
var camera;
var scene;

var stars = [];

var draw_stars = function() {
	var start = time.get_timestamp();
	screen.clear();
	_.each(stars,function(star){
		context.fillStyle = star.color;
		var c = trig.p2c(star.r,star.theta);		
		context.fillRect(c.x+canvas.width/2,c.y+canvas.height/2,1,1);
	});
	var end = time.get_timestamp();
	$('#stats').html(end-start);
}

var flat_random = function(count) {
	stars = [];
	for(var i=0;i<count;i++) {
		var x = (0.5-Math.random())*canvas.width;
		var y = (0.5-Math.random())*canvas.height;
		var p = trig.c2p(x,y);
		
		stars.push({r:p.r,theta:p.theta,color:'white'});
	}
}


var normal_random = function(count) {
	stars = [];
	for(var i=0;i<count;i++) {
		var x = nrnd(canvas.width,0);
		var y = nrnd(canvas.height,0);
		var p = trig.c2p(x,y);
		
		stars.push({r:p.r,theta:p.theta,color:'white'});
	}
}

var polar_flat_random = function(count) {
	stars = [];
	for(var i=0;i<count;i++) {
		var r = Math.random()*canvas.height/2;
		var theta = Math.random()*2*Math.PI;

		var c = trig.p2c(r,theta);

		stars.push({r:r,theta:theta,color:'white'});
	}
}

var polar_normal_random = function(count) {
	stars = [];
	for(var i=0;i<count;i++) {
		var r = Math.abs(nrnd(canvas.height,0));
		var theta = Math.random()*2*Math.PI;
		
		var c = trig.p2c(r,theta);
		stars.push({r:r,theta:theta,color:'white'});
	}
}

var spikes = function(count) {
	stars = [];
	for(var i=0;i<count;i++) {
		var spikes = 5;
		var spike_width = 5;
		//var theta = Math.random()*2*Math.PI;

		var r = Math.abs(nrnd(canvas.height,0));
		var theta = nrnd(2*Math.PI/spike_width,((2*Math.PI)/spikes)*(i%spikes));
		
		var c = trig.p2c(r,theta);
		stars.push({r:r,theta:theta,color:'white'});
	}
}


var rotate_stars = function(degrees) {
	_.each(stars,function(star){
		star.theta += trig.deg2rad(degrees);
	});
} 

var smear_stars = function(degrees) {
	_.each(stars,function(star){
		var x = degrees/star.r;
		star.theta += trig.deg2rad(x*10);
		//star.theta += (0.5-Math.random())*(star.r/300);
	});
} 


var nrnd = function(dev,mean) {
	var sum = 0;
	var cnt = 3;
	for(var i=0;i<cnt;i++) {
		sum += (0.5-Math.random())/cnt;
	}
	return sum*dev +mean;
}



$(function() {
	canvas = $('#my_canvas')[0];
	canvas.onselectstart = function () { return false; }	// This stops the double click from selecting text on the page
	context = canvas.getContext('2d');

	screen = new Screen(canvas.width,canvas.height,context);
	camera = new Camera(0,0,0.007848062);	// Should reduce radius to 50
//	scene = new Scene(screen,camera);

	screen.clear();
	
	var cnt = 5000; 
	
	$('#flat_random_btn').click(function() { flat_random(cnt); draw_stars();} );
	$('#normal_random_btn').click(function() { normal_random(cnt); draw_stars(); } );
	$('#polar_flat_random_btn').click(function() { polar_flat_random(cnt); draw_stars(); } );
	$('#polar_normal_random_btn').click(function() { polar_normal_random(cnt); draw_stars(); } );
	$('#spikes_btn').click(function() { spikes(cnt); draw_stars(); } );
	
	$('#rotate_btn').click(function() { rotate_stars(1); draw_stars(); } );
	$('#smear_btn').click(function() { smear_stars(10); draw_stars(); } );
});