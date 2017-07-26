/**
 * Created by geniu on 2017-05-20.
 */
var express = require('express');
var router = express.Router();
var User = require("../models/userDB");
var Doctor = require("../models/doctorDB");
var AddUserDB = require("../models/Add_user_info");

var bodyParser = require("body-parser");

/* GET home page. */
router.get('/doctor', function (req, res, next) {
    console.log("good");
    var doctorid = req.query.doctorid;
    console.log(req.query.doctorid);
    console.log(req.query.password);

    Doctor.findOne({Doctor_ID: doctorid, Doctor_pw: req.query.password}, function (err, doctor) {
        if (err) return res.status(400).send("error to find doctor");
        if (!doctor) return res.status(404).send("error to find doctor");
        else {
            console.log("의사 찾았다!!");
            User.find({Doctor_ID: doctorid}, function (err, users) {

                console.log(users);
                if (err) return res.status(404).send("일치하는 유저와 의사 정보가 없습니다.");
                else {
                    return res.render("doctor.ejs", {userData: users, doctorData: doctorid});
                }
            });
        }
    });
});
router.get('/doctor/detail/', function (req, res, next) {
    console.log(req.url);
    var uLArray = new Array();
    var uLTID = new Array();
    uLArray = req.url.split("?");
    uLTID = uLArray[1].split("=");

    var name = req.query.name;
    var doctorid = req.query.doctorid;
    console.log(uLTID[1]);

    var urLTID = uLTID[1];

    AddUserDB.find({name: name}, function (err, adduser) {
        if (err) return console.log("LTID error");
        else {
            console.log(adduser);
            if (!adduser) return console.log("해당 LTID를 가진 유저가 없습니다.");

            else
                Doctor.findOne({Doctor_ID: doctorid}, function (err, doctorsid) {
                    console.log(doctorsid);
                    if (err) return console.log("Doctor_id error");
                    else{
                        return res.render('detail',{doctorData: doctorid,addUser : adduser});
                    }
                });
        }
    });
});

router.post("/doctor/detail/addInfo", function (req, res, next) {
    var LTID2 = req.body.LTID2;
    var name = req.body.name2;
    var disease = req.body.disease2;
    var visitDate = req.body.visitDate;
    var nextVisit = req.body.nextVisit;
    var care = req.body.care;

    console.log(LTID2 + " / " + name + "/" + disease  +"/"+ visitDate + "/" + nextVisit + "/" + care);

    var addUserDB = new AddUserDB({
        LTID: LTID2,
        name: name,
        add_disease: disease,
        visit: visitDate,
        visit_schedule: nextVisit,
        Doctor_ID: " ",
        care: care
    });

    addUserDB.save(function (err, userInfo) {
        if (err) return console.log("추가 데이터 저장 에러");
        else return res.send("well done");
    });
});

module.exports = router;