/**
 * Created by yn782 on 2017-08-17.
 */
var express = require("express");
var router = express.Router();

var http = require("http");
var Dynamic = require("../models/dynamicDB");
var Guardian = require("../models/guardianDB");
var mongoose = require("mongoose");
var user = undefined;
var Provider = require("../models/provider/provider_check");

router.get("/map", function (req, res, next) {
    console.log("요청::" + req.user.provider);
    if (req.user.provider == "facebook") {
        console.log(req.user.provider);
        var Name = req.user._json.name
    } else {
        console.log(req.user._json.kaccount_email);
        var Name = req.user._json.kaccount_email
    }
    console.log("이름:"+Name);
    Guardian.collection.findOne({name:Name}, function(err,guardinfo) {
        console.log(guardinfo.LTID+"LTID입니다.");
        Dynamic.collection.find({LTID: guardinfo.LTID}).sort({time: -1}).toArray(function (err, dynamics) {
            console.log(dynamics[0].time);
            console.log(dynamics[0].lat);
            return res.render("map.ejs", {dyanmicData: dynamics[0]});
        });

        /* Dynamic.findOne({$query: {LTID: guardinfo.LTID}.sort({time:1})}, function (err, dynamics) {

         console.log(dynamics.time);
         console.log(dynamics.lat);
         return res.render("map.ejs", {dyanmicData: dynamics});
         });*/
    });
});


module.exports = router;
