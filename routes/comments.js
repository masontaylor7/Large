const express = require('express');
const db = require('../db/models');
const { csrfProtection, asyncHandler, getDate } = require('./utils');
const { check, validationResult, Result } = require('express-validator');
const { loginUser, requireAuth } = require('../auth');
const router = express.Router();


const commentValidator = [
    check('content')
        .exists({ checkFalsy: true })
        .withMessage("Comment can't be empty."),
]


router.put('/:id(\\d+)', commentValidator, asyncHandler(async(req, res, next) => {
    const { content } = req.body;
    const comment = await db.Comment.findOne({
        where:{
            id: req.params.id
        }
    })


    if(comment){
        await comment.update({ content })
        res.json({ comment })
    }else{
        const err = new Error();
        err.status(404);
        next(404);
    }
}));

router.delete('/:id', asyncHandler(async(req, res, next) => {
    console.log("INSIDE DELETE ROUTE")
    const id = req.params.id;
    const comment = await db.Comment.findOne({
        where: {
            id
        }});
    console.log("COMMENT IS ", comment);
    if (req.session.auth.userId !== comment.userId) {
        const error = new Error("Not Authorized.");
        error.status = 401;
        next(error);
    }
    if (comment) {
        await comment.destroy();
        res.json({ message: "Success!" })
    } else {
        const error = new Error("Comment not found.");
        error.status = 404;
        next(error);
    }
}));









module.exports = router;
