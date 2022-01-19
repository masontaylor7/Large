var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { loginUser } = require('../auth');




// const loginValidations = [
//     check()
// ]


router.get('/', csrfProtection, asyncHandler(async(req, res, next) => {

}));


router.post('/', csrfProtection, asyncHandler(async(req, res, next)=> {

}));
