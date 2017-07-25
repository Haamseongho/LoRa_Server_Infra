var express = require("express");
var router = express.Router();
var passport = require("passport");
// router.get("/login_success",ensureAuthenticated , function (req,res) {
//     console.log("req.admin : " + req.admin);
//     res.send(req.admin);
// });
//
// function ensureAuthenticated(req,res,next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/"); // 다시 돌려보내!!
// }
module.exports = router;