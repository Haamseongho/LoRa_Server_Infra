/**
 * Created by haams on 2017-05-12.
 */
var express = require("express");
var router = express.Router();
var Admin = require("../models/adminDB");

router.get("/", function (req, res, next) {
    res.render("register");
});

router.post("/", function (req, res, next) {
    var email = req.body.adminId;
    var password = req.body.adminPw;

    console.log(email+"/"+password);

    var admin = new Admin({
        email: email,
        password: password
    });

   /* admin.collection.insert({ email : email , password: password},function (err,admin) {
        if(err) return console.log("저장 실패");
        return console.log(admin);
    });

    console.log(admin);*/
    admin.save(function (error, admin) {
        if (error) console.log(error);
        else {
            return res.redirect("/");
        }
    })
});

module.exports = router;