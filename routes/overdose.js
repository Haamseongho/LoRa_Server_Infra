/**
 * Created by yn782 on 2017-08-17.
 */
var express = require("express");
var router = express.Router();
var http = require("http");
var Dynamic = require("../models/dynamicDB");
var Guardian = require("../models/guardianDB");
var Medicine = require("../models/med_form/medFormDB");
var mongoose = require("mongoose");
var user = undefined;

router.get("/overdose", function (req, res, next) {
    if(req.user.provider == "facebook"){
        console.log(req.user.provider);
        var Name=req.user._json.name
    }else{
        console.log(req.user._json.kaccount_email);
        var Name=req.user._json.kaccount_email
    }
    Guardian.findOne({name:Name},function(err, guardinfo) {
        console.log(guardinfo.LTID);
        var LTID_Guard = guardinfo.LTID;

        //보호자와 연결된 환자의 약 알림 리스트
        Medicine.find({LTID:LTID_Guard},function(err,medinfo){
        return res.render("overdose.ejs",{MedInfo:medinfo});
        });
    });

});



module.exports = router;