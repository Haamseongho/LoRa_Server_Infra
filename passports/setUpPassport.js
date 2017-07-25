/**
 * Created by haams on 2017-05-16.
 */
var passport = require("passport");
var Admin = require("../models/adminDB");
var LocalStrategy = require("passport-local").Strategy;
var local_login = require('./passport_route/local_login');
var local_signup = require('./passport_route/local_signup');
module.exports = function () {
    console.log("passport - setupPassport");

    passport.serializeUser(function (user,done) {
        console.log("serializeUser()호출");
        console.dir(user);
        done(null,user);

    });

    passport.deserializeUser(function (user,done) {
        console.log("deserializeUser() 호출");
        console.dir(user);
        done(null,user);
    });

    passport.use('local-login',local_login);
    passport.use('local-signup', local_signup);

};