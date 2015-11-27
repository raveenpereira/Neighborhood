var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var home = require('./routes/home');
var ajax = require('./routes/ajax');
var session = require('client-sessions');

var app = express();

// all environments
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  }));
app.set('port', process.env.PORT || 4500);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', home.signin);
app.get('/profile',home.profile);
app.get('/ajax', ajax.demo);
app.get('/signin', home.signin);
app.post('/signUp',home.signUp);
app.post('/afterSignIn', home.afterSignIn);
app.post('/submitPost',home.submitPost);
app.get('/getPosts',home.getPosts);
app.get('/getAllPosts',home.getAllPosts);
//app.get('/afterSignIn',home.home);
//app.post('/getAllUsers', home.getAllUsers);
app.post('/searchUsers', home.searchUsers);
app.post('/createGroup',home.createGroup);
app.get('/redirectToGrp', home.redirectToGrp);
app.get('/getUserGroups',home.getUserGroups);
app.get('/logout',home.logout);
app.get('/getUserProfile/:profileid',home.getUserProfile);
//app.post('/addMember', home.addMember);
//app.post('/addRequests',home.addRequests);
//app.post('/showRequests', home.showRequests);
//app.post('/showFriends',home.showFriends);
//app.post('/removeGroup',home.removeGroup);


app.get('/ajaxDemo', ajax.handleGetReq);
app.post('/ajaxDemo', ajax.handlePostReq);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
