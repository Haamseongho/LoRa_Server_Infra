var express = require('express');
var router = express.Router();
var User = require("../models/userDB");
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("is it okay?");
    res.render('index', { title: 'Express' });
});

module.exports = router;