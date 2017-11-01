/**
 * Created by haams on 2017-09-01.
 */
var express = require("express");
var router = express.Router();
var UserInfo = require("../../models/userDB");
var Dynamic = require("../../models/dynamicDB");

function updateUDataByLTID(LTID, lat, lon, pulse, callback) {
    var userInfo = new UserInfo();
    userInfo.updateDynamicData(LTID, lat, lon, pulse, function (err, userInfo) {
        if (err) return console.log('사용자 정보 - 위도/경도/맥박 갱신 실패');
        else {
            console.log('사용자 정보 - 위도/경도/맥박 갱신 성공!!');
            callback(err, userInfo);
        }
    })
}
router.post("/dynamics", function (req, res, next) {
    var LTID = req.body.LTID;
    var userInfo = new UserInfo();
    var dynamic = new Dynamic();
    Dynamic.collection.find({LTID:LTID}).sort({time:-1}).toArray(function(err,dynamics){
	if(err) return console.log("해당 LTID는 존재하지 않습니다.");
	else{
	    console.log("LTID가 동일합니다.");
	    updateUDataByLTID(dynamics[0].LTID,dynamics[0].lat,dynamics[0].lon,dynamics[0].pulse,function(err,userInfo){
		if(err) return console.log("사용자 정보 - 맥박/위도/경도 갱신 실패");
		else{
		    console.log("사용자 정보 - 위도/경도/맥박 갱신 성공");
		    console.log(JSON.stringify(userInfo));
		}
	    });
	}
    });
/*
    dynamic.findLTIDForLatLng(LTID, function (err, dynamicData) {
        if (err) return console.log('해당 LTID는 존재하지 않습니다');
        // 사용자가 가입 시에 정한 LTID와 ThingPlug server에서 넘어온 LTID는 동일해야함.
        else {
            // LTID 동일하다는 것을 확인 --> 이제 유저 정보의 lat,lng,pulse에 적용
            // dynamicData에서 뽑아올 것 - lat,lng,pulse
            console.log("LTID가 동일합니다.");
            updateUDataByLTID(dynamicData.LTID, dynamicData.lat, dynamicData.lon, dynamicData.pulse, function (err, userInfo) {
                if (err) return console.log('사용자 정보 - 맥박/위도/경도 갱신 실패');
                else {
                    console.log('사용자 정보 - 위/경/맥 갱신 성공');
                    console.log(JSON.stringify(userInfo)); // 갱신된 정보 보내기 (lat,lon,pulse by LTID)
                }
            });

        }
    })
*/
});

router.get("/spotinfo",function (req,res,next) {
    var userInfo = new UserInfo();
    var LTID = req.query.LTID;
    userInfo.getLatLng(LTID,function (err,userInfo) {
        if(err) return console.log('사용자 정보를 찾을 수 없습니다 .. LTID를 확인해주세요');
        else{
            console.log('사용자 정보 확인 - LTID 일치');
            return res.status(200).json(userInfo);
        }
    })
});

router.get("/getLTID", function (req, res, next) {
    var tel = req.query.tel;
    console.log(tel + "입니다.");
    console.log("LTID");
    var userInfo = new UserInfo();
    userInfo.getLTID(tel, function (err, user) {
        if (err) return console.log("error");
        else {
            console.log(user);
            res.status(200).json(user);
        }
    })
});


module.exports = router;
