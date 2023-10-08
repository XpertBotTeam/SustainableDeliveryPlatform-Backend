var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//google auth
const passport = require('passport');

//define routers
const indexRouter = require('./routes/index');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');
const companyAdmin = require('./routes/companyAdmin');
const userAdmin = require('./routes/userAdmin');
const deliveryAdmin = require('./routes/deliveryGuyAdmin');
const admin = require('./routes/admin');

//import cors
const cors = require('cors')

var app = express();

//google auth
app.use(session({
  secret: 'SECRETKEY',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'images')));


//set up cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '100mb' })); 
app.use(express.urlencoded({ limit: '100mb', extended: true })); 

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//defining endpoints for routers
app.use('/auth',authRouter);
app.use('/shop',shopRouter)
app.use('/company',companyAdmin)
app.use('/user',userAdmin)
app.use('/deliveryGuy',deliveryAdmin)
app.use('/admin',admin)

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
