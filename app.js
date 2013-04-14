var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');
  

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'models')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes/index.js')(app);
require('./routes/main.js')(app);
require('./routes/thing_routes.js')(app);

http.createServer(app).listen(app.get('port'), function(){
  fs.writeFile('pid.txt',process.pid, function(err) {
    if(err) {
        process.exit();
    } else {
      console.log("Express server listening on port " + app.get('port'));
    }
  })
});

/* The below code is the infinate loop pattern
var pr = function() {
    for(var i=0;i<oo.length;i++) {
        oo[i].update(new Date());
    }
    process.nextTick(pr);
}*/
