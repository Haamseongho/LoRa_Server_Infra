/**
 * Created by haams on 2017-09-11.
 */



var passport = require("passport");
var KakaoStrategy = require("passport-kakao").Strategy;
var expressSession = require("express-session");
var express = require("express");
var router = express.Router();

module.exports = function (router, passport) {
    passport.use(new KakaoStrategy({
            clientID: "7e02cea565a694a8332d9ee1677ecd6a",
            callbackURL: "/auth/kakao/callback"
        }, function (accessToken, refreshToken, profile, done) {
            console.log("kakao" + profile);
            done(null, profile);
        }
    ));

    passport.serializeUser(function (user, done) {
        console.log("serializeUser() 호출");
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        console.log("deserializeUser() 호출");
        done(null, user);
    });

    router.use(expressSession({
        secret: "ubinet111",
        resave: true,
        saveUninitialized: true
    }));
    router.use(passport.initialize());
    router.use(passport.session());

    router.get("/auth/kakao", passport.authenticate('kakao'));
    router.get("/auth/kakao/callback", passport.authenticate('kakao',
        {
            successRedirect: "/login_success",
            failureRedirect: "/login_fail"
        }));

    router.get("/login_success", ensureAuthenticated, function (req, res) {
        console.log("login_success 호출");
        res.redirect("/main");
    });
    router.get("/login_fail", function (req, res) {
        console.log("로그인 실패");
        res.redirect("/"); // 로그인실패 --> 메인 페이지 이동
    });
    router.get("/main", function (req, res) {
        console.log("프로필 호출");
        console.log(req.user);
        if (Array.isArray(req.user)) {
            res.render("main.ejs", {user: req.user[0]._doc});
        } else {
            res.render("main.ejs", {user: req.user});
        }
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("인증 완료");
            next();
        } else {
            res.redirect("/");
        }
    }
};