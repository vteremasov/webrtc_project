
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    loginPage = require('./routes/login'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    WebRtcServer = require('./lib/wsserver').WebRtcServer,
    httpServer = null,
    wss = null;


var app = express();

// all environments
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
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', loginPage.showLogin);
app.get('/users', user.list);
app.post('/login', loginPage.postLogin);
app.get('/logout', routes.logout);
app.get('/getUserName', routes.getUserName);

httpServer = http.createServer(app);

httpServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

wss = new WebRtcServer();
wss.listen(httpServer);
