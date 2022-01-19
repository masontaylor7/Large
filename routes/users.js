var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('./utils');
const { logoutUser } = require('../auth');

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    res.redirect('/');
})


router.get('/:id', asyncHandler(async(req, res, next) => {
    const user = await db.Post.findByPk(req.params.id, {
        include: db.Post
    });

    
    res.render('profile-page', { user })
}));


module.exports = router;
