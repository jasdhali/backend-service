var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var birds = require('./birds')
var books = require('./server')
var profile = require('./src/profile')
var accounts = require('./src/payment/accounts')
var otpOperations = require('./src/otp/otpOperations')
var chgops = require('./src/charginghome/ChargerOperations')
var chargingHistory = require('./src/charginghome/ChargingHistory')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use('/birds', birds)
app.use('/books', books)
app.use('/profile', profile)
app.use('/accounts', accounts)
app.use('/otpOperations', otpOperations)
app.use('/chgops', chgops)
app.use('/chargingHistory', chargingHistory)



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/users/:userId/books/:bookId', function (req, res) {
  res.send(req.params)
})
app.get('/example/a', function (req, res) {
  res.send('Hello from A!')
})
app.get('/example/b' , function(req, res, next){
  console.log('the response will be sent by the next function.....');
  next()
}, function (req, res) {
  res.send('Hello from B!')
})
app.route('/book').get(function(req,res){res.send('Get a random book')})
.post(function(req,res){res.send('Add a random book')})

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
