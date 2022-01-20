const express = require('express');
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const {requireAuth } = require('../auth');
const router = express.Router();



router.get('/', csrfProtection, requireAuth, asyncHandler(async(req, res, next) => {
    const user = await db.User.findOne({
        where:{
            id: req.session.auth.userId
        }
    })

    res.render('post-form', {
        csrfToken: req.csrfToken(),
        title: 'Post Form'
    });
}));


const postFormValidations = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Title')
        .isLength({ max: 100 })
        .withMessage('Username must not be more than 50 characters long'),
    check('content')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Title'),
]

router.post('/', csrfProtection, postFormValidations, asyncHandler(async(req, res, next) => {
    const { title, content } = req.body;
    const post = await db.Post.build({
        title,
        content,
        userId: req.session.auth.userId,
    });

    const postErrors = validationResult(req);

    if(postErrors.isEmpty()){
        await post.save();
        res.redirect(`/users/${req.session.auth.userId}`);
    }else{
        const errors = postErrors.array().map((error) => error.msg);
        res.render('post-form', {
            title: 'Post Form',
            post,
            errors,
            csrfToken: req.csrfToken(),
        })
    }

}));






module.exports = router;
