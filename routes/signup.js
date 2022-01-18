var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');


router.get('/', csrfProtection, asyncHandler(async(req, res) => {
    const user = await db.User.build();

    res.render('sign-up', {csrfToken: req.csrfToken(), user, title: 'Sign-Up Form'})
}));

router.post('/', csrfProtection, asyncHandler(async(req, res) => {

}));


module.exports = router;
