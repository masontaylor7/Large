var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');


router.get('/', csrfProtection, asyncHandler(async(req, res) => {

}));

router.post('/', csrfProtection, asyncHandler(async(req, res) => {

}));


module.exports = router;
