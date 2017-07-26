/**
 * Created by haams on 2017-05-16.
 */
var passport = require("passport");
var Admin = require("../models/adminDB");
var LocalStrategy = require("passport-local").Strategy;
module.exports = function () {
    passport.serializeUser(function (admin, done) {
        console.log(admin.adminId);
        done(null, admin._id);
    });

    passport.deserializeUser(function (id, done) {
        console.log(admin.adminPw);
        Admin.findById(id, function (err, admin) {
            console.log("error??11");
            done(err, admin);
        })
    });

    passport.use("login", new LocalStrategy(function (adminId, adminPw, done) {
        console.log("여기가 잘못된건가?");
        Admin.findOne({adminId: adminId}, function (err, admin) {
            if (err) return done(err);
            if (!admin) return done(null, false, {message: "유저 정보가 없습니다."});
            admin.checkPassword(adminPw, function (err, isMatch) {
                if (err) {
                    console.log("error??");
                    return done(err);
                }
                if (isMatch) {
                    return done(null, admin);
                } else {
                    return done(null, false, {message: "비밀번호가 틀렸습니다."});
                }
            });
        });
    }));
};