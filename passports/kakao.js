/**
 * Created by haams on 2017-09-11.
 */



var passport = require("passport");
var KakaoStrategy = require("passport-kakao").Strategy;
var expressSession = require("express-session");
var express = require("express");
var router = express.Router();
var Guard = require("../models/guardianDB");


module.exports = function (router, passport) {
    passport.use(new KakaoStrategy({
            clientID: "7e02cea565a694a8332d9ee1677ecd6a",
            callbackURL: "/auth/kakao/callback"
        }, function (accessToken, refreshToken, profile, done) {
            console.log("kakao" + profile.username);
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

    router.get("/login_success", ensureAuthenticated, function (req, res, next) {
        console.log("login~~success 호출");
        res.redirect("/main");
    });
    router.get("/login_fail", function (req, res) {
        console.log("로그인 실패");
        res.redirect("/"); // 로그인실패 --> 메인 페이지 이동
    });

    router.get("/main", function (req, res) {
        if (Array.isArray(req.user)) {
            switch (check_provider(req.user.provider)) {
                case 0: {
                    console.log(req.user.provider);
                    console.log("Nothing to start");
                    res.redirect("/");
                }
                    break;

                case 1: { // 카카오톡 로그인
                    console.log("카카오톡 로그인" + req.user);
                    isUserExisted(req.user.username, function (err, user) {
                        if (err) alert("해당 카카오 계정의 사용자가 존재하지 않습니다.");
                        else if (!user) {
                            res.status(404).send("해당 카카오 계정의 사용자가 존재하지 않습니다. App에서 먼저 가입해주세요.");
                        } else {
                            res.status(200).render("main.ejs", {user: req.user[0]._doc})
                        }
                    })
                }
                    break;
            }

            // 기존에 세션이 존재하지 않을 경우

        } else {
            switch (check_provider(req.user.provider)) {
                case 0: {
                    console.log("Nothing to start");
                    res.redirect("/");
                }
                    break;


                case 1: { // 카카오톡 로그인
                    console.log("카카오톡 로그인");
                    isUserExisted(req.user.username, function (err, user) {
                        if (err) console.log("해당 카카오 계정의 사용자가 존재하지 않습니다.");
                        else if (!user) {
                            res.status(404).send("해당 카카오 계정의 사용자가 존재하지 않습니다. App에서 먼저 가입해주세요.");
                        } else {
                            res.status(200).render("main.ejs", {user: req.user})
                        }
                    })
                }
                    break;
            }
        }
    });


    function check_provider(provider) {
        if (provider == "kakao") {

            return 1;
        } else {
            return 0;
        }
    }

    function isUserExisted(name, callback) {
        var guard = new Guard();
        guard.isUserExisted(name, callback);
    }


    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("인증 완료");
            next();
        } else {
            res.redirect("/");
        }
    }
};

