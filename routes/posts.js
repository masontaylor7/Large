const express = require('express');
const db = require('../db/models');
const { csrfProtection, asyncHandler, getDate } = require('./utils');
const { check, validationResult, Result } = require('express-validator');
const { loginUser, requireAuth } = require('../auth');
const router = express.Router();

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const postDate = getDate;
    const postId = parseInt(req.params.id, 10);
    const post = await db.Post.findByPk(postId, {
        include: [db.User],
    });
    res.render('specific-post', {
        post,
        postDate
    })
}));











module.exports = router;
