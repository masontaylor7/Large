const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const postRouter = require('./routes/posts');
const { superSecret }  = require('./config');
const { restoreUser } = require('./auth');

const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(superSecret));
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: superSecret,
    store,
    saveUninitialized: false,
    resave: false,
  })
  );

  // create Session table if it doesn't already exist
  store.sync();

app.use(restoreUser);
app.use(indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/users', usersRouter);
app.use((req, res, next) => {
  console.log("this is before posts router")
  next();
});
app.use('/posts', postRouter);

app.use((req, res, next) => {
  const e = new Error('The request couldn\'t be found')
  e.status = 404
  next(e)
})

// catch 404 and forward to error handler
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    console.log("any random string")
    res.status(404);
    res.render('404', {
      title: 'Page Not Found',
    });
  } else {
    console.log("any random string 2")

    next(err);
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
