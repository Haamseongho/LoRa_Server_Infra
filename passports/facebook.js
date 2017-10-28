/**
 * Created by haams on 2017-09-11.
 */
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var expressSession = require("express-session");
var express = require("express");
var router = express.Router();
var Guard = require("../models/guardianDB");

module.exports = function (router, passport) {
    passport.use(new FacebookStrategy({
            clientID: "1489945794382557",
            clientSecret: "28fd8417f74493346ccabb984224acdc",
            callbackURL: "/auth/facebook/callback"
        }, function (accessToken, refreshToken, profile, done) {
            console.log("facebook" + profile.toString());
            done(null, profile);
        }
    ));

    passport.serializeUser(function (user, done) {
        console.log("SerializeUser() 호출");
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

    router.get("/auth/facebook", passport.authenticate('facebook'));
    router.get("/auth/facebook/callback", passport.authenticate('facebook',
        {
            successRedirect: "/login_success",
            failureRedirect: "/login_fail"
        }));

    router.get("/login_success", ensureAuthenticated, function (req, res) {
        console.log("login success 호출");
        res.redirect("/main");
    });
    // 로그인 성공 시 /main 으로 redirection -- 라우터에서 해결 (get으로 넘어옴);

    router.get("/login_fail", function (req, res) {
        console.log("login fail");
        res.redirect("/");
    });

    // 로그인 실패 시 원래 있던 페이지로 다시 돌아오기

    router.get("/main", function (req, res) {

        console.log(req.user.provider + "입니다.");
        if (Array.isArray(req.user)) {
            switch (check_provider(req.user.provider)) {
                case 0: {
                    console.log("Nothing to start");
                    res.redirect("/");
                }
                    break;

                case 1: { // 페이스북 로그인
                    console.log("페이스북 로그인1");
                    isUserExisted(req.user.displayName, function (err, user) {
                        if (err) console.log("해당 페이스북 계정의 사용자가 존재하지 않습니다.");
                        else if (!user) {
                            res.status(404).send("해당 페이스북 계정의 사용자가 존재하지 않습니다. App에서 먼저 가입해주세요.");
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


                case 1: { //  페이스북 로그인
                    console.log("페이스북 로그인2" + req.user.displayName);
                    isUserExisted(req.user.displayName, function (err, user) {
                        if (err) console.log("해당 페이스북 계정의 사용자가 존재하지 않습니다.");
                        else if (!user) {
                            res.status(404).send("해당 페이스북 계정의 사용자가 존재하지 않습니다. App에서 먼저 가입해주세요.");
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
        if (provider == "facebook") {

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
            // 인증이 안될 경우 현 페이지 위치
        }
    }
};
