var express = require("express");
var router = express.Router();
var http = require("http");
var User = require("../models/userDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var flash = require("connect-flash");
var User = require("../models/userDB");
var passport = require("passport-local");



router.get("/", ensureAuthenticated, function (req, res,next) {
  //  console.log(req.admin +"입니다.");
    return res.render('main.ejs');
});



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.session.passport.admin +"입니다.");
        return next();
    }
    else {
        console.log("로그인 해야됩니다!!");
        req.flash("info", "먼저 로그인 해야 페이지 방문이 가능합니다.");
        res.redirect("/register");
    }
}


router.post("/", function (req, res, next) {
    var name = req.body.name;
    var address = req.body.address;
    var phoneNumber = req.body.phoneNumber;
    var age = req.body.age;
    var disease = req.body.disease;
    var beatData = req.body.beatData;
    var heartData = req.body.heartData;
    var lat = req.body.lat;
    var lon = req.body.lon;
    var spot = req.body.spot;
    var resourceId = req.body.resourceId;
    var content = req.body.content;
    var LTID = req.body.LTID;


    console.log(req.url);
    console.log(name + "/" + address + "/" + phoneNumber + "/" + age + "/" + disease);

    var user = new User({
        name: name,
        age: age,
        LTID: "aaa ",
        beatData: 0.0,
        heartData: 0.0,
        content: "aaa ",
        lat: 0.0,
        lon: 0.0,
        spot: "aaa ",
        resourceId: " aaaa",
        created_at: Date(),
        address: address,
        phoneNumber: phoneNumber,
        disease: disease
    });
    console.log(user);
    // LTID , heartData , beatData , spot , lat, lon , resourceId , 구체화 해야함!
    user.save(function (err, user) {
        if (err) return console.log("error saving user data into Database");
        return console.log("saved in database well");
    });
    User.findOne({
        LTID: LTID, name: name, address: address
        , phoneNumber: phoneNumber, age: age, disease: disease
    }, function (error, user) {
        if (error) console.log('There is no data in database');

        var f_LTID = user.LTID;
        var f_name = user.name;
        var f_address = user.address;
        var f_beatData = user.beatData;
        var f_heartData = user.heartData;
        var f_phoneNumber = user.phoneNumber;
        var f_disease = user.disease;

        res.send({
            LTID: f_LTID, name: f_name, address: f_address,
            beatData: f_beatData, heartData: f_heartData, phoneNumber: f_phoneNumber
            , disease: f_disease
        });
    });
});

module.exports = router;
