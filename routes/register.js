/**
 * Created by haams on 2017-05-12.
 */
var express = require("express");
var router = express.Router();
var Admin = require("../models/adminDB");
var passport = require("passport");
var LocalStrategy = require("passport-local");

router.get("/", function (req, res, next) {
    res.render("register");
});
router.post("/", function (req, res, next) {

    var adminId = req.body.adminId;
    var adminPw = req.body.adminPw;
    var adminLocation = req.body.adminLocation;

    Admin.findOne({
        adminId: req.body.adminId
        , adminPw: req.body.adminPw
    }, function (error, admin) {
        console.log(admin);
        if (error) return done(error);
        if (admin) {
            return console.log("이미 사용자가 존재합니다.");
        }
        var admin = new Admin({
            adminId: adminId,
            adminPw: adminPw,
            adminLocation: adminLocation
        });

        admin.save({
            adminId: adminId,
            adminPw: adminPw,
            adminLocation: adminLocation
        })

    });
    return res.redirect("/");
});
//
// passport.use('signup', new LocalStrategy({
//         usernameField: 'adminId',
//         passwordField: 'adminPw',
//         locationField: 'adminLocation',
//         passReqToCallback: true
//     },
//     function (req, adminId, adminPw, adminLocation, done) {
//         Admin.findOne({
//             adminId: req.body.adminId
//             , adminPw: req.body.adminPw
//         }, function (error, admin) {
//             console.log(admin);
//             if (error) return done(error);
//             if (admin) {
//                 return console.log("이미 사용자가 존재합니다.");
//             }
//             var admin = new Admin({
//                 adminId: adminId,
//                 adminPw: adminPw,
//                 adminLocation: adminLocation
//             });
//
//             admin.save({
//                 adminId: adminId,
//                 adminPw: adminPw,
//                 adminLocation: adminLocation
//             })
//             return res.redirect("/");
//         });
//     }
// ));
//
//
// passport.use('signup', new LocalStrategy({
//     usernameField: 'adminId',
//     passwordField: 'adminPw',
//     passReqToCallback: true
// }, function (req, adminId, adminPw, done) {
//     Admin.findOne({adminId: req.body.adminId}, function (err, admin) {
//         if (err) console.log("error find the user");
//         if (!admin) return done(null, false, {message: "유저 정보가 없습니다."});
//         return done(null, admin);
//         admin.checkPassword(adminPw, function (err, isMatch) {
//             if (err) return done(err);
//             if (isMatch) return done(null, admin);
//             else return done(null, false, {message: "비밀번호 오류"});
//         });
//     })
// }));


module.exports = router;