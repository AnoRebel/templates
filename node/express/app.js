const express = require('express');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const httpErrors = require('http-errors');
const nunjucks = require('nunjucks');
const { handleResponses, handleRequests } = require('express-oas-generator');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
/** MUST be the FIRST middleware - handle the responses */
if (process.env.NODE_ENV !== 'production') {
  handleResponses(app, {
    // specOutputPath: openAPIFilePath,
    writeIntervalMs: 0,
      swaggerUiServePath: "/docs"
  });
}; 

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.json(err);
  res.render('error');
});

/** lastly - add the express-oas-generator request handler (MUST be the LAST middleware) */
if (process.env.NODE_ENV !== 'production') {
  handleRequests();
};

module.exports = app;
