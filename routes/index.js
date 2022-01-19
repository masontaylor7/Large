var express = require('express');
var router = express.Router();
const db = require('../db/models')
const { asyncHandler } = require('./utils')

/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  const isLoggedIn = res.locals.verified;
  let posts;
  if (isLoggedIn) {
    // Change to get all posts from people user follows
    posts = await db.Post.findAll({
      include: 'User'
    });
  } else {
    posts = await db.Post.findAll({
      include: 'User'
    });
  }
  console.log(posts);
  res.render('index', {
    title: 'Large Home Page',
    isLoggedIn,
    posts
  });
}));

module.exports = router;
