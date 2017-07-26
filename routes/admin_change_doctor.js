var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");

var http = require("http");
var User = require("../models/userDB");
var Doctor = require("../models/doctorDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var dbUrl = "mongodb://cadi_project:123123@ds155418.mlab.com:55418/cadi_project";

/* GET home page. */
router.get('/admin_change_doctor', function (req, res, next) {
    console.log("good");


    var LTID=req.query.LTID;
    var doctorid = req.query.Doctor_ID;
    console.log(req.query.LTID);
    console.log(req.query.Doctor_ID);

    User.findOne({LTID:LTID},function(err,users){
        console.log(users);
        if(err)
            return res.status(400).send("error to find LTID1");
        if (!users)
            return res.status(404).send("error to find LTID2");
        else{
            Doctor.find({}, function (err, doctor) {
                console.log(doctor);
                if (err) return res.status(404).send("일치하는 유저와 의사 정보가 없습니다.");
                return res.render("admin_change_doctor.ejs", {DoctorsData: doctor, UsersData:users});
            });
        }
    });
});

module.exports = router;