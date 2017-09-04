/**
 * Created by yn782 on 2017-05-21.
 */
var express = require('express');
var router = express.Router();
var Admin = require("../models/adminDB");
var Doctor = require("../models/doctorDB");
var User = require("../models/userDB");
var AddUserDB = require("../models/add_user_info");

var bodyParser = require("body-parser");

/* GET home page. */
router.get('/main', function (req, res, next) {
    console.log("good");
    var adminid = req.query.institution;
    console.log(req.query.institution);
    console.log(req.query.password);
    Admin.findOne({email: adminid, password: req.query.password}, function (err, admin) {
        if (err) return res.status(400).send("error to find admin");
        if (!admin) return res.status(404).send("error to find admin");
        else {
            Doctor.find({}, function (err, doctor) {
                console.log(doctor);
                if (err) return res.status(404).send("일치하는 유저와 의사 정보가 없습니다.");
                User.find({}, function (err, users) {
                    console.log(users);
                    return res.render("main.ejs", {DoctorsData: doctor, UsersData: users, AdminsData: admin});
                })

            });
        }
    });
});

module.exports = router;