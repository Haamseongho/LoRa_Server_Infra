var express = require("express");
var router = express.Router();
var http = require("http");
var User = require("../models/userDB");
var Guardian = require("../models/guardianDB");
var Dynamic = require("../models/dynamicDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var dbUrl = "mongodb://cadi_project:123123@ds155418.mlab.com:55418/cadi_project";

// /* GET home page. */
//
router.get('/main/test3', function (req, res, next) {
    console.log("GOOD");

    if (req.user.provider == "facebook") {
        console.log(req.user.provider);
        var Name = req.user._json.name
    } else {
        console.log(req.user._json.kaccount_email);
        var Name = req.user._json.kaccount_email
    }

    Guardian.findOne({name: Name}, function (err, guardinfo) {
        console.log(guardinfo.LTID);
        Dynamic.collection.find({LTID: guardinfo.LTID}).sort({time: 1}).toArray(function (err, dynamics) {
            console.log(dynamics);
            return res.render("test3.ejs", {DynamicData: dynamics});
        });

    });
    // var LTID = req.query.LTID;
    // User.findOne({LTID:LTID},function(err, users){
    //     Dynamic.find({LTID:LTID},function(err, dynamics){
    //         console.log(dynamics);
    //         if(err)
    //             return res.status(404).send("일치하는 LTID가 없습니다.");
    //         return res.render("test3.ejs",{DynamicData:dynamics,UsersData:users});
    //
    //     });
    // });
});


router.post("/", function (req, res, next) {
    var LTID = req.body.LTID;
    var name = req.body.name;
    var age = req.body.age;

    try {
        User.updateMany({LTID: LTID},
            {$set: {name: name}}, {upsert: true}
        );
    } catch (e) {
        console.log("error");
    }
    User.find({
        LTID: LTID
    }, function (error, user) {
        if (error) console.log('There is no data in database');

        var f_LTID = user.LTID;
        var f_name = user.name;
        var f_age = user.age;

        res.send({
            LTID: f_LTID, name: f_name, age: f_age
        });
    }).sort({"created_at": 1});
});

module.exports = router;