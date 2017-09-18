/**
 * Created by haams on 2017-09-01.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var guardSchema = Schema({
    id: {type: String},
    email: {type: String},
    LTID: {type: String},      // 디바이스 사용자 문자 인증 과정을 통한 LTID 매핑
    name: {type: String}       // SNS 계정 로그인을 통해 기본 프로필 정보에서 뽑아 온 사용자 이름
});

/*
 보호자(앱 사용자) 정보 저장
 */


guardSchema.methods.insertUserInfo = function (LTID, name, callback) {
    this.model("Guard").collection.insert({LTID: LTID, name: name}, callback);
};
/*
 이미 앱에서 저장된 보호자 정보를 가지고 오는 것임
 가입 시에 name을 가지고 (공통적으로 뽑아 올 수 있는 정보는 name입니다. - facebook & kakao)
 그 이름이 있을 경우 거기에 저장된 LTID를 한 번 더 대화상자로 띄웁니다.
 만약 name이 없을 경우 로그인이 안되도록 --> 대화상자로 앱에서 먼저 로그인 해주라고 경고 상자 띄우기
 */
guardSchema.methods.isUserExisted = function (name, callback) {
    console.log("유저가 존재하는지 체크합니다.");
    this.model("Guard").collection.findOne({name: name}, callback);
};


var Guard = mongoose.model("Guard", guardSchema);

module.exports = Guard;
