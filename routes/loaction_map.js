var express = require('express');
var router = express.Router();
var User = require("../models/userDB");
/* GET home page. */
router.get('/main/map', function(req, res, next) {
    res.render('map', { title: 'Express' });
});

module.exports = router;