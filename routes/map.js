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

router.get("/map", function (req, res, next) {

    if(req.user.provider == "facebook"){
        console.log(req.user.provider);
        var Name=req.user._json.name
    }else{
        console.log(req.user._json.kaccount_email);
        var Name=req.user._json.kaccount_email
    }
    Guardian.findOne({name:Name},function(err, guardinfo) {
        console.log(guardinfo.LTID);

        Dynamic.findOne({ $query:{LTID:guardinfo.LTID},$orderby:{time:-1}},function(err,dynamics) {
            console.log(dynamics.time);
            console.log(dynamics.lat);
            return res.render("map.ejs", {dyanmicData: dynamics});
        });
    });
});



module.exports = router;