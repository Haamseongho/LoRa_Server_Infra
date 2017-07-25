var express = require('express');
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Admin = require("../models/adminDB");
var session = require("express-session");

router.use(passport.initialize());
router.use(passport.session());
router.use(session({
    secret: 'ubinet',
    resave: true,
    saveUninitialized: true
}));
var User = require("../models/userDB");
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.route("/login").post(passport.authenticate('local',
    {
        successRedirect:'/login_success',
        failureRedirect: '/register',
        failureFlash: true
    }));


passport.use('local',new LocalStrategy({
        usernameField: 'adminId',
        passwordField: 'adminPw',
        passReqToCallback: true
    },
    function (req, adminId, adminPw, done) {
        Admin.findOne({adminId: req.body.adminId}, function (error, admin) {
            if (error) return done(error);
            if (!admin) {
                return console.log("관리자 유저가 없습니다.");
            }
            // admin.checkPassword(req.body.adminPw, function (err, isMatch) {
            //     if (err) return console.log("비밀번호에러");
            //     if (!isMatch) return console.log("비밀번호가 일치하지 않습니다.");
            //     return done(null, admin);
            // })
            // console.log(admin);
            return done(null, admin);
        });
    }
));

passport.serializeUser(function (admin, done) {
    console.log("serialized " + admin._id);
    done(null, admin._id);
});

passport.deserializeUser(function (id, done) {
    console.log('deserialize' + id);
    Admin.findById(id, function (err, admin) {
       // console.log(admin.adminId + " / " + admin.adminPw);
        done(err, admin);
    });
});

router.get("/login_success",function (req,res) {
    passport.deserializeUser(function (id, done) {
        console.log('deserialize' + id);
        Admin.findById(id, function (err, admin) {
            console.log(admin.adminId + " / " + admin.adminPw);
            done(err, admin);
        });
    });
    return res.render("main",req.admin);
});

module.exports = router;
