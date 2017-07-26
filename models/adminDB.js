/**
 * Created by haams on 2017-05-12.
 */
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

var noop = function () {
};
// nothing to do

var adminSchema = new Schema({

    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    user_uid: {
        type: String,
        default:""
    },
    adminLocation: {
        type: String,
        default:""
    }
});

adminSchema.pre("save", function (done) {
    console.log("pre saved 호출()");
    var admin = this;
    if (!admin.isModified("adminPw")) {
        return done(); // 비밀번호 수정 안되면 로직 넘어가기
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) { // Hashing --> 부가적 값 생성 / 완료될 경우 내부 함수 호출.
        if (err) return done(err);
        bcrypt.hash(admin.adminPw, salt, noop, function (err, hashedPassword) {
            if (err) return done(err);
            admin.adminPw = hashedPassword;
            console.log(admin.adminPw);
            done(); // hashed success !!
        });
    });
});

adminSchema.methods.checkID = function (adminId, callback) {
    return this.model("Admin").findOne({email: adminId},callback);
};


adminSchema.methods.checkPassword = function (guess, done) { // guess --> 입력할 비밀 번호 / 현재 page에서 보여지는 element의 password 비교
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        bcrypt.hash(guess, salt, noop, function (err, hashPassword) {
            if (err) return done(err);
            guess = hashPassword;
            bcrypt.compare(guess, this.adminPw, function (err, isMatch) { // 비교시에는 첫 인자 err 두 번째 인자 isMatch
                done(null, isMatch); // 결국 done으로 내보낼 때에는 err과 isMatch 같이 보내기 // 잘될 경우는 보통 null 과 같이 내보낸다.
            });
        });
    });
};


var Admin = mongoose.model('Admin', adminSchema);


module.exports = Admin;
