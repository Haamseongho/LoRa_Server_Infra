/**
 * Created by haams on 2017-05-18.
 */
var LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy({
    usernameField : 'adminId',
    passwordField : 'adminPw',
    passReqToCallback : true
},function (req,adminId,adminPw,done) {
    var adminName = req.param('adminId')
})