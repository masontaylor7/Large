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
    if (post) {
        res.render('specific-post', {
            user: req.session.auth.userId,
            userId,
            post,
            postDate
        })
    } else {
        const error = new Error()
        error.status = 404
        next(error)
    }

}));


const commentValidator = [
    check('comment')
        .exists({ checkFalsy: true })
        .withMessage("Comment can't be empty."),
]

router.post('/:id(\\d+)', commentValidator, asyncHandler(async(req, res) => {
    console.log("router");
    console.log(req.body);
        const { comment } = req.body;
        const postId = req.params.id;
        const userId = req.session.auth.userId;
        const newComment = await db.Comment.build({
            content: comment,
            postId,
            userId
        });

        const commentErrors = validationResult(req);

        if (commentErrors.isEmpty()) {
            const user = await db.User.findOne({
                where: { id : userId }
            });
            newComment.username = user.username;
            await newComment.save();
            res.json(newComment);
        } else {
            const errors = commentErrors.array().map((error) => error.msg)[0];
            res.json(errors);

        }

        // console.log(newComment);
        // res.json(newComment);
    // } catch (e) {
    //     console.log(e);
    // }
}));

router.get('/', csrfProtection, requireAuth, asyncHandler(async(req, res, next) => {
    const user = await db.User.findOne({
        where:{
            id: req.session.auth.userId
        }
    })

    res.render('post-form', {
        csrfToken: req.csrfToken(),
        title: 'Post Form',
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

router.get('/:id(\\d+)/comments', asyncHandler(async(req, res) => {
    const postId = req.params.id;
    const result = await db.Comment.findAll({
        where: { postId },
        order: [['updatedAt', 'DESC']],
        include: db.User
    });
    const data = JSON.stringify(result);
    res.send(data);
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
    const comments = await db.Comment.findAll({
        where: {
            postId
        }
    })

    comments.forEach(async(comment) => {
        await comment.destroy();
    })

    await specificPost.destroy()

    res.redirect(`/users/${specificPost.userId}`)


}));





module.exports = router;
