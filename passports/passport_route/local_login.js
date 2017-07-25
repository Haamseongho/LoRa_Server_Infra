/**
 * Created by haams on 2017-05-18.
 */
var LocalStrategy = require("passport-local").Strategy;
var Admin = require("../../models/adminDB");

module.exports = new LocalStrategy({
    usernameField : 'adminId',
    passwordField : 'adminPw',
    passReqToCallback : true
},function(req,adminId,adminPw,done){
    console.log('passport-local_login 호출' + adminId +'/' +adminPw);
    Admin.findOne({ 'adminId' : adminId },function (err,user) {
        if(err) {return done(err);}
        if(!user) {
            console.log('계정 일치 x');
            return done(null,false,req,flash('loginMessage','등록된 계정이 없습니다.'));
        }
        user.checkPassword(adminPw,function (err,isMatch) {
            if(err) {return done(err);}
            if(!isMatch) { return done(null,false,req.flash('loginMessage','비밀번호가 일치하지 않습니다.'))}
            return done(null,user);
        })
    })    
});