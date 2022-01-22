const express = require('express');
const db = require('../db/models');
const { csrfProtection, asyncHandler, getDate } = require('./utils');
const { check, validationResult, Result } = require('express-validator');
const { loginUser, requireAuth } = require('../auth');
const router = express.Router();



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
