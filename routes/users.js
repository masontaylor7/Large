var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { asyncHandler, getDate } = require('./utils');
const { logoutUser } = require('../auth');

router.get('/', asyncHandler(async(req, res) => {
    const userId = req.session.auth.userId;
    const user = await db.User.findOne({
        where: { id: userId }
    });
    const data = JSON.stringify(user);
    res.send(data);
}));

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    res.redirect('/');
})


router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const postDate = getDate;
    const userId = parseInt(req.params.id, 10);
    const currentUser = req.session.auth.userId
    const userPage = await db.User.findByPk(userId)
    const user = await db.Post.findAll({
        include: [db.User],
        where: {
            userId
        },
        order: [['updatedAt', 'DESC']]
    });
    if(userPage){
        res.render('profile-page', {
            currentUser,
            userPage,
            user,
            postDate
        })
    }else {
        const error = new Error()
        error.status = 404
        next(error)
    }

}));


module.exports = router;
