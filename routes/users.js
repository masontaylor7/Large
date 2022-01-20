var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('./utils');
const { logoutUser } = require('../auth');

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    res.redirect('/');
})


router.get('/:id(\\d+)', asyncHandler(async(req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    console.log(userId)
    const user = await db.Post.findAll({
        include: [db.User],
        where: {
            userId
        }
    });
    
    res.render('profile-page', { user })
}));


module.exports = router;
