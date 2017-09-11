/**
 * Created by haams on 2017-09-01.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var guardSchema = Schema({
    id: {type: String},
    password: {type: String},
    LTID: {type: String},      // 디바이스 사용자 문자 인증 과정을 통한 LTID 매핑
    name: {type: String}       // SNS 계정 로그인을 통해 기본 프로필 정보에서 뽑아 온 사용자 이름
});
/*
 보호자(앱 사용자) 정보 저장
 */

var Guard = mongoose.model("Guard", guardSchema);

guardSchema.methods.saveUserInfo = function (LTID, name, callback) {
    this.model("Guard").collection.save({LTID: LTID, name: name}, callback);
};

module.exports = Guard;
