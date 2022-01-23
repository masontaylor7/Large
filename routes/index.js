var express = require('express');
var router = express.Router();
const db = require('../db/models')
const { asyncHandler, getDate } = require('./utils')

/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  const isLoggedIn = res.locals.verified;
  const postDate = getDate;
  console.log("isLoggedIn: ", isLoggedIn);
  let posts;
  let user;
  if (isLoggedIn) {
    // Change to get all posts from people user follows
    posts = await db.Post.findAll({
      include: 'User',
      order: [['updatedAt', 'DESC']]
    });
    user = req.session.auth.userId
  } else {
    posts = await db.Post.findAll({
      include: 'User',
      order: [['updatedAt', 'DESC']]
    });
  }
  // console.clearlog(posts);
  res.render('index', {
    title: 'Large Home Page',
    isLoggedIn,
    user,
    posts,
    postDate
  });
}));

module.exports = router;
