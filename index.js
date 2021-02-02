const express = require('express');
const path = require('path');
const hbs = require('hbs');
const routes = require('./routes/');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const fileUpload = require('express-fileupload');

require('dotenv').config({ path: 'variables.env' });

const app = express();

// Express-validator
app.use( expressValidator() );

// Body parser
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

// Habilitar hbs como templete engine
require('./hbs/helper');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Archivos staticos
app.use( express.static( path.resolve(__dirname, 'public') ) );

// Alertas
app.use( cookieParser() );

app.use(session({
	secret: process.env.KEY,
	resave: true,
	saveUninitialized: true,
}));

app.use( flash() );

app.use((req, res, next) => {

	res.locals.mensajes = req.flash();
	next();
});

// Passport
app.use( passport.initialize() );
app.use( passport.session() );

app.use( fileUpload() );

// Fecha
hbs.registerHelper('fecha', () => new Date().getFullYear());

// Base de datos
require('./config/db');

app.use('/', routes() );

app.listen(process.env.PORT, () => console.log('corriendo en el puerto ' + process.env.PORT));