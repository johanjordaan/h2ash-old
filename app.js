var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');
var sessionStore = new express.session.MemoryStore();
var SITE_SECRET = 'why is this secret';

var app = express();

var cp = express.cookieParser(SITE_SECRET); 

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(cp);
  app.use(express.session({key:'express.sid',store:sessionStore}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'views')));
  app.use(express.static(path.join(__dirname, 'utils')));
  app.use(express.static(path.join(__dirname, 'modules')));
  app.use(express.static(path.join(__dirname, 'fx')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes/index.js')(app);
require('./routes/main.js')(app);


var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.set('authorization', function(data, accept){
  /* NOTE: To detect which session this socket is associated with,
   *       we need to parse the cookies. */
  if (!data.headers.cookie) {
    return accept('Session cookie required.', false);
  }
 
  /* XXX: Here be hacks! Both of these methods are part of Connect's
   *      private API, meaning there's no guarantee they won't change
   *      even on minor revision changes. Be careful (but still
   *      use this code!) */
  /* NOTE: First parse the cookies into a half-formed object. */
  //data.cookie = cookie.parse(data.headers.cookie);
  /* NOTE: Next, verify the signature of the session cookie. */
  //data.sessionID = cookie.parseSignedCookie(data.cookie['connect.sid'], SITE_SECRET);
 
  /* NOTE: save ourselves a copy of the sessionID. */
  //data.sessionID = data.cookie['express.sid'];
  var req = {headers:{cookie:data.headers.cookie}};
  cp(req,{},function(){
	  /* NOTE: get the associated session for this ID. If it doesn't exist,
	   *       then bail. */
	  console.log(req.signedCookies); 
	  data.sessionID = req.signedCookies['express.sid'];
	  sessionStore.get(data.sessionID, function(err, session){
		if (err) {
		  return accept('Error in session store.', false);
		} else if (!session) {
		  return accept('Session not found.', false);
		}
		// success! we're authenticated with a known session.
		data.session = session;
		return accept(null, true);
	  });
  });
});

io.sockets.on('connection', function(socket){
  var hs = socket.handshake;
  console.log('A socket with sessionID '+hs.sessionID+' connected.');
 
  /* NOTE: At this point, you win. You can use hs.sessionID and
   *       hs.session. */
console.log('--->');
console.log(hs.session);	
 
  /* NOTE: This function could end here, and everything would be fine.
   *       However, I included this additional mechanism that Daniel
   *       added to keep the session alive by pinging it every 60
   *       seconds. I don't know how useful this is in the context of
   *       this demo, considering that the sessions aren't going to
   *       expire in the near future. So feel free to not include this: */
  var intervalID = setInterval(function(){
    hs.session.reload(function(){
      hs.session.touch().save();
    });
  }, 60 * 1000);
  socket.on('disconnect', function(){
    console.log('A socket with sessionID '+hs.sessionID+' disconnected.');
    clearInterval(intervalID);
  });
 
});


server.listen(app.get('port'), function(){
  fs.writeFile('pid.txt',process.pid, function(err) {
    if(err) {
        process.exit();
    } else {
      console.log("Express server listening on port " + app.get('port'));
    }
  })
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


/* The below code is the infinate loop pattern
var pr = function() {
    for(var i=0;i<oo.length;i++) {
        oo[i].update(new Date());
    }
    process.nextTick(pr);
}*/
