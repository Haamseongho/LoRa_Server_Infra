/**
 * Created by haams on 2017-05-18.
 */
var express = require("express");
var router = express.Router();
var User = require("../models/userDB");


router.get("/main/graph", function (req, res, next) {
    console.log("data is alright");
    return res.render("graph");
});


router.post("/main/graph", function (req, res, next) {
    return res.render("graph");
});

// router.get("/",function (req,res,next) {
//     res.render("register");
// });

module.exports = router;