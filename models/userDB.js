var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var alarmTimeSchema = new Schema({
    alarm1: {
        type: String,
        default: ""
    },
    alarm2: {
        type: String,
        default: ""
    },
    alarm3: {
        type: String,
        default: ""
    }
});
// alarm1 = medFormDB에서 첫 번째 시 : 분
// alarm2 = medFormDB에서 두 번째 시 : 분
// alarm3 = medFormDB에서 세 번째 시 : 분
//  ' 시:분 ' 으로 정의된 문자열은 추 후에 : 이걸 없애서 시간으로 조정을 형변환을 하던 문자열로 알림 형태를 조정하여 알림을 보낼 수 있도록 한다.
var userSchema = new Schema({

    LTID: {
        type: String,
        default: ""
    },
    lat: {
        type: Number,
        default: ""
    },
    lon: {
        type: Number,
        default: ""
    },
    tel: {
        type: Number,// 01046182721 ( '-' 없이 적어주기 ),
        default: ""
    },
    medname: {
        type: String,
        default: ""
    },
    pulse: {
        type: Number,
        default: ""
    },
    startDate: {
        type: Date,
        default: ""
    },
    endDate: {
        type: Date,
        default: ""
    },
    alarmTime: [alarmTimeSchema]

});


userSchema.methods.getSpotData = function (lat, lon, callback) {
    this.model("User").collection.insert({lat: lat, lon: lon}, callback);
};

userSchema.methods.getPulseData = function (pulse, callback) {
    this.model("User").collection.insert({pulse: pulse}, callback);
};

userSchema.methods.getMedData = function (medname, startDate, endDate, alarmTime, callback) {
    /*
     라우터에서 시,분을 각각 받아서 하나의 시간 문자열로 정리를 해둔다.
     정리를 하게 되면 3개의 문자열이 나올 것이고, 이를 하나의 오브젝트로 정의하여 alarmTime 위치이 저장한다.
     예 : alarm1 = req.body.hour[0] + ":" + req.body.minute[0]
     ...

     alarmTime : {
     alarm1 : alarm1,
     alarm2 : alarm2,
     alarm3 : alarm3
     }
     위와 같은 방식으로 정의한 뒤 추가하기.
     */
    this.model("User").collection.insert({
        medname: medname,
        startDate: startDate,
        endDate: endDate,
        alarmTime: alarmTime
    }, callback);
};
userSchema.methods.getLTID = function (tel, callback) {
    console.log('find the telecom number');
    this.model("User").collection.findOne({tel: tel}, callback);
    // 전화번호 일치시 callback 주기 --> LTID 가져올 예정.
};

userSchema.methods.updateUserInfoByAlarmData = function (LTID, medName, startDate, endDate, alarm1, alarm2, alarm3, callback) {
    console.log("유저 정보 업데이트 진행");
    this.model("User").collection.update({LTID: LTID}, {
        $set: {
            medname: medName,
            startDate: startDate,
            endDate: endDate,
            $alarmTime: {alarm1: alarm1, alarm2: alarm2, alarm3: alarm3}
        }
    }, {upsert: true, multi: true}, callback)
};

var User = mongoose.model('User', userSchema);


module.exports = User;
