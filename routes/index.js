var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const isLoggedIn = res.locals.verified;
  if (isLoggedIn) {

  } else {
    // const posts =
  }
  res.render('index', {
    title: 'Large Home Page',
    isLoggedIn
  });
});

module.exports = router;
