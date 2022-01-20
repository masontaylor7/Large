var express = require('express');
const { logoutUser } = require('../auth');

var router = express.Router();

router.post('/', (req, res)=> {
    logoutUser(req, res);
});

module.exports = router;
