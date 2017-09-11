var express = require('express');
var router = express.Router();
var User = require("../models/userDB");


var fb_login = require("../passports/facebook");
var kk_login = require("../passports/kakao");

var passport = require("passport");
/* GET home page. */

fb_login(router,passport);
kk_login(router,passport);


router.get('/', function(req, res, next) {
    console.log("is it okay?");
    res.render('index', { title: 'Express' });
});

router.get("/logout",function (req,res,next) {
    req.logout();
    req.redirect("/");
});


module.exports = router;