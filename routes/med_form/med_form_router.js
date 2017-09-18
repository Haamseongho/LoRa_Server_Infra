/**
 * Created by haams on 2017-08-17.
 */
var express = require("express");
var router = express.Router();
var MedForm = require("../../models/med_form/medFormDB");
var User = require("../../models/userDB");

/*
 투약 알림 설정
 */
function insertMedInfoData(LTID,medName, alarmHour, alarmHour2, alarmHour3, alarmMin, alarmMin2, alarmMin3, startDate, endDate, callback) {
    var medform = new MedForm({
        LTID : LTID,
        medname: medName,
        alarmHour: {
            hour1: alarmHour,
            hour2: alarmHour2,
            hour3: alarmHour3
        },
        alarmMin: {
            minute1: alarmMin,
            minute2: alarmMin2,
            minute3: alarmMin3
        },
        startDate: startDate,
        endDate: endDate
    });
    medform.save(function (err, medFormData) {
        if (err) return console.log('투약 알림 설정 저장 에러');
        else {
            console.log("투약 알림 설정 저장 성공");
            callback(err, medFormData);
        }
    })
}

function updateUserInfo(LTID, medName, startDate, endDate, alarm1, alarm2, alarm3, callback) {
    /*
     alarm 데이터만 삽입
     */
    var user = new User();
    user.updateUserInfoByAlarmData(LTID, medName, startDate, endDate, alarm1, alarm2, alarm3, function (err, alarmData) {
        if (err) return console.log("알림 데이터로 유저 정보 갱신 실패");
        else {
            console.log("알림 데이터로 유저 정보 갱신 성공 ");
            callback(err, alarmData);
        }
    });
}

router.post("/insert", function (req, res, next) {
    var medName = req.body.medName;
    var LTID = req.body.LTID;
    // LTID를 같이 보낼 것 -- 이걸 가지고 다른 정보들 업데이트 할 것이기 때문 (안드로이드에서 작업할 부분) - sharedPreference
    // client - medName
    var alarmHour = req.body.alarmHour[0];
    var alarmHour2 = req.body.alarmHour[1];
    var alarmHour3 = req.body.alarmHour[2];

    var alarmMin = req.body.alarmMin[0];
    var alarmMin2 = req.body.alarmMin[1];
    var alarmMin3 = req.body.alarmMin[2];


    var alarm1 = alarmHour + ":" + alarmMin;
    var alarm2 = alarmHour2 + ":" + alarmMin2;
    var alarm3 = alarmHour3 + ":" + alarmMin3;

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    console.log(medName);
    console.log("약이름:" + medName + "/시" + alarmHour + "/" + alarmHour2 + "/" + alarmMin + "/" + alarmMin2 +
        "/" + startDate + "/" + endDate);

    insertMedInfoData(LTID,medName, alarmHour, alarmHour2, alarmHour3, alarmMin, alarmMin2, alarmMin3, startDate, endDate, function (err, medForm) {
        if (err) return console.log("투약 알림 정보 데이터 저장 실패");
        else {
            updateUserInfo(LTID, medName, startDate, endDate, alarm1, alarm2, alarm3, function (err, alarmData) {
                if (err) return console.log('투약 알람 시간 정보 저장 실패');
                else {
                    console.log("투약 알림 저장한 거 유저에 접목이 되었음");
                }
            });
            console.log("투약 알림 정보 데이터 저장은 성공 하였음");
            return res.status(200).send(JSON.stringify(medForm));
        }
    });


    /*
     medName,startDate,endDate,alarmTime{alarm1,alarm2,alarm3} --> userDB에 업데이트 하도록
     남은 부분은 lat,lon,pulse 인데 이 부분은 Lora - upLink 작업
     */
    /*
     updateUserInfo(LTID,medName,startDate,endDate,alarm1,alarm2,alarm3,function(err,alarmData){
	if(err) return console.log("투약 알림 시간 정보 저장 실패 ");
        else{
 	     console.log('투약 알림 저장한 거 유저에 접목 되었음');
             return res.status(200).json(alarmData);
        }
    });
   */
});

module.exports = router;
