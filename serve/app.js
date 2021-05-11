var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const api = require('./routes/api');

var app = express();

const mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//连接数据库
mongoose.connect(`mongodb://shopadmin:123456@localhost:27017/vueshop`,{useNewUrlParser: true});

//cors config here
app.all('/*',function(req, res, next) {
  //cors headers
  res.header("Access-Control-Allow-Origin", "*"); //restrict it to the required domain
  res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");
  //Set custom headers for CORS
  res.header("Access-Control-Allow-Header","Content-type,Accept,X-Access-Token,X-key");
  if(req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
