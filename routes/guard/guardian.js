/**
 * Created by haams on 2017-09-01.
 */
var express = require("express");
var router = express.Router();
var Guard = require("../../models/guardianDB");

function insertInfoData(LTID,name,callback) {
    var guard = new Guard();
    guard.saveUserInfo(LTID,name,function (err,guard) {
        if(err) return console.log("보호자 정보 입력이 잘못되었습니다.");
        else{
            console.log("보호자 정보가 정확하게 저장되었습니다.");
            callback(err,guard);
            /*
            guard --> 제대로 데이터가 입력될 경우 나온 올바른 정보
             */
        }
    })
}

router.post("/insertinfo",function (req,res,next) {
    var LTID = req.body.LTID;
    var name = req.body.name;
    console.log("done well insertinfo");
    insertInfoData(LTID,name,function (err,guard) {
        if(err) return res.send(new Error("보호자 정보 입력 에러"));
        else{
            return res.status(200).json(guard);
        }
    })
});
module.exports = router;