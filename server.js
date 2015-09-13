var express 			= require('express');
var fs 					= require('fs');
var mysql 				= require('mysql');
var path				= require('path');
var logger				= require('morgan');
var express				= require('express');
var bodyParser			= require('body-parser');
var cookieParser		= require('cookie-parser');
var session				= require('express-session');
var expressValidator	= require('express-validator');
var connection			= require('express-myconnection');

var app					= express();

app.engine('html', require('ejs').__express);
app.set('views','./views');
app.set('view engine','html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser('secretString'));

app.use(session({
	cookieName: "session",
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	secret: 'Lonely Boy',
	resave: true,
	saveUninitialized: true,
	cookie: {maxAge: 3600000}
	}	
));

/*MySql Connection*/
/* Comment this part if don't have database install'*/
app.use(connection(mysql,{
	host     : 'movies.cazlh4nyhwx5.us-east-1.rds.amazonaws.com',
	database : 'movies',
	user     : 'root',
	password : 'password'
    },'request')
);


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Routes	
var router 			= express.Router();
var index 			= require('./routes/index');

app.use('/', index);

//start Server
var server = app.listen(8080,function(){
	console.log("Listening to port %s",server.address().port);
});
