var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var body_parser = require('body-parser');
var methodOverride = require("method-override");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var semestresRouter = require('./routes/semestres');
var gruposRouter = require('./routes/grupos');
var carrerasRouter = require('./routes/carreras');
var maestrosRouter = require('./routes/maestros');
var alumnosRouter = require('./routes/alumnos');
var modulosRouter = require('./routes/modulos');
var submodulosRouter = require('./routes/submodulos');
var materiasRouter = require('./routes/materias');
var listasRouter = require('./routes/listas');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/semestres', semestresRouter);
app.use('/grupos', gruposRouter);
app.use('/carreras', carrerasRouter);
app.use('/maestros', maestrosRouter);
app.use('/alumnos', alumnosRouter);
app.use('/modulos', modulosRouter);
app.use('/submodulos', submodulosRouter);
app.use('/materias', materiasRouter);
app.use('/listas', listasRouter);

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
