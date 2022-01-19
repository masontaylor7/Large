var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const signupValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Username')
        .isLength({ max: 50 })
        .withMessage('Username must not be more than 50 characters long'),
    check('email')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Email')
        .isLength({ max: 255 })
        .withMessage('Email must not be more than 255 characters long')
        .isEmail()
        .withMessage('Provide a valid Email')
        .custom((value) => {
            return db.User.findOne({ where: { email: value } })
              .then((user) => {
                if (user) {
                  return Promise.reject('The provided Email Address is already in use by another account');
                }
              });
        }),
    check('password')
        .exists({ checkFalsy: true})
        .withMessage('Please provide value for Password')
        .isLength({max: 255})
        .withMessage('Password must not be more than 255 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
        .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
    check('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Confirm Password')
        .isLength({ max: 255 })
        .withMessage('Confirm Password must not be more than 255 characters long')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm Password does not match Password');
        }
        return true;
        }),
]

router.get('/', csrfProtection, asyncHandler(async(req, res) => {
    const user = await db.User.build();

    res.render('sign-up', {csrfToken: req.csrfToken(), user, title: 'Sign-Up Form'})
}));

router.post('/', csrfProtection, signupValidators, asyncHandler(async(req, res, next) => {
    const {
        username,
        email,
        password
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.build({
        username,
        email,
        hashedPassword
    });

    const validationErrors = validationResult(req);

    if(validationErrors.isEmpty()){
        await user.save();
        res.redirect('/')
    }else{
        const errors = validationErrors.array().map((error) => error.msg);
        res.render('sign-up', {
            title: 'Sign-Up Form',
            user,
            errors,
            csrfToken: req.csrfToken(),
        });
    }



}));


module.exports = router;
