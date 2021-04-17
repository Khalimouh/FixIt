var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var helmet = require('helmet');
var cors = require("cors");
require('dotenv').config();

var indexRouter = require('./routes/index');


var app = express();

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n4mow.mongodb.net/FixIt?retryWrites=true&w=majority`;
mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      keepAlive: 1,
      connectTimeoutMS: 30000
    }, function(err, res) {
        if(err) console.error(err);
        else console.log("Connection réussie");
    }
);

let db = mongoose.connection;

app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
//defini un dossier statique accessible par le navigateur
app.use(express.static(path.join(__dirname, 'public')));


//Defini les routeurs a appliquer
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
