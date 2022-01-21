const express = require('express');
const db = require('../db/models');
const { csrfProtection, asyncHandler, getDate } = require('./utils');
const { check, validationResult, Result } = require('express-validator');
const { loginUser, requireAuth } = require('../auth');
const router = express.Router();

router.get('/:id(\\d+)', requireAuth, asyncHandler(async (req, res, next) => {
    const userId = req.session.auth.userId
    const postDate = getDate;
    const postId = parseInt(req.params.id, 10);
    const post = await db.Post.findByPk(postId, {
        include: [db.User],
    });
    res.render('specific-post', {
        user: req.session.auth.userId,
        userId,
        post,
        postDate
    })
}));

router.get('/', csrfProtection, requireAuth, asyncHandler(async (req, res, next) => {
    const user = await db.User.findOne({
        where:{
            id: req.session.auth.userId
        }
    })

    res.render('post-form', {
        csrfToken: req.csrfToken(),
        title: 'Post Form',
        postDate,
        user
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

router.get('/:id(\\d+)/edit', csrfProtection, asyncHandler(async(req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await db.Post.findByPk(postId, {
        include: db.User
    });

    res.render('post-edit', {
      title: 'Edit Post',
      post,
      csrfToken: req.csrfToken(),
    });
}));

router.post('/:id(\\d+)/edit',csrfProtection, postFormValidations, asyncHandler(async(req, res) => {
    const postId = parseInt(req.params.id, 10);
    const specificPost = await db.Post.findByPk(postId,{
        include: db.User
    });

    const {
        title,
        content,
    } = req.body;

    const post = {
        title,
        content
    };

    const postErrorsValidators = validationResult(req);

    if (postErrorsValidators.isEmpty()) {
      await specificPost.update(post);
      res.redirect(`/posts/${postId}`);
    } else {
      const errors = postErrorsValidators.array().map((error) => error.msg);
      res.render('post-edit', {
        title: 'Edit Post',
        post: { id: postId, ...post },
        errors,
        csrfToken: req.csrfToken(),
      });
    }
}));

router.get('/delete/:id(\\d+)', csrfProtection, asyncHandler(async(req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.session.auth.userId
    const postDate = getDate;
    const post = await db.Post.findByPk(postId,{
        include: db.User
    });

    res.render('specific-post-delete',{
        userId,
        post,
        postDate,
        csrfToken: req.csrfToken(),
    });


}));


router.post('/delete/:id(\\d+)', csrfProtection, asyncHandler(async(req, res) => {
    const postId = parseInt(req.params.id, 10);
    const specificPost = await db.Post.findByPk(postId,{
        include: db.User
    });
    await specificPost.destroy()

    res.redirect(`/users/${specificPost.userId}`)


}));





module.exports = router;
