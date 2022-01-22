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








module.exports = router;
