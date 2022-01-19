var express = require('express');
var router = express.Router();
const db = require('../db/models');
const { asyncHandler } = require('./utils');
const { logoutUser } = require('../auth');

router.post('/logout', (req, res) => {
    logoutUser(req, res);
    res.redirect('/');
})



module.exports = router;
