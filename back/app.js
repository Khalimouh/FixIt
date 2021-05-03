var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var helmet = require('helmet');
var cors = require("cors");
const auth = require('./routes/auth');
const RateLimit = require('express-rate-limit');
require('dotenv').config();

var indexRouter = require('./routes/index');

//Crée l'application Express
var app = express();
app.set('view engine', 'ejs');

//rate limiter pour empecher les attaques par dos
const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
});
app.use(limiter);

const url = "mongodb+srv://" + process.env.DB_USER + ":" +process.env.DB_PASS+"@cluster0.n4mow.mongodb.net/FixIt?retryWrites=true&w=majority";
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

//Chargement des middlewares
app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieParser());
//defini un dossier statique accessible par le navigateur
app.use(express.static(path.join(__dirname, 'public')));

//Defini les routeurs a appliquer
app.use('/auth', auth);
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
    console.log(err);
  res.status(err.status || 500).json(err);
});

module.exports = app;
