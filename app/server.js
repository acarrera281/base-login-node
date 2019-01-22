var express = require('express');
var app = express();

const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');


//conexion a bd
const { url } = require('../config/database');
//const url = require('../config/database');
//mongoose.connect(url, { 
	//useMongoClient: true
	//promiseLibrary: global.Promise
//});
mongoose.connect(url);


require('../config/passport.js')(passport);

//Settings
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//middleware
app.use(morgan('dev'));
app.use(cookieParser(''));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
	secret: 'loginPrueba',
	resave: 'false',
	//saveUnitialized: 'false'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//rutas
require('../app/routes.js')(app, passport);

//
app.use(express.static(path.join(__dirname,'public')));

app.listen(3000,function(){
	console.log("Servidor activo");
});
