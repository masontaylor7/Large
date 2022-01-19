var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult, Result } = require('express-validator');
const bcrypt = require('bcryptjs');
const { loginUser } = require('../auth');




const loginValidations = [
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please enter an email address to log in.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please enter a password to log in.')
]


router.get('/', csrfProtection, asyncHandler(async(req, res, next) => {
    res.render('login', {
        title: 'Log In',
        csrfToken: req.csrfToken()
    });
}));


router.post('/', csrfProtection, loginValidations, asyncHandler(async(req, res, next)=> {
    const {
        email,
        password
    } = req.body;

    let errors = [];
    const loginErrors = validationResult(req);

    if (loginErrors.isEmpty()) {
        const user = await db.User.findOne({
            where: {
                email
            }
        });

        if (user) {
            const confirmPassword = await bcrypt.compare(password, user.hashedPassword);

            if (confirmPassword) {
                loginUser(req, res, user);
                res.redirect('/');
            }
        }

        errors.push('Invalid email or password.')
    } else {
        errors = loginErrors.array().map((err) => err.msg);
    }

    res.render('login', {
        title: 'Log In',
        email,
        errors,
        csrfToken: req.csrfToken()
    });
}));

module.exports = router;
