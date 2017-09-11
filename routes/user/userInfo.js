/**
 * Created by haams on 2017-09-01.
 */
var express = require("express");
var router = express.Router();
var UserInfo = require("../../models/userDB");

router.post("/spotInfo", function (req, res, next) {
    var lat = req.body.lat;
    var lon = req.body.lon;
    console.log("spotInfo");
    var userInfo = new UserInfo();
    userInfo.getSpotData(lat,lon,function (err,userInfo) {
        if(err) return console.log("위도 경도 insert 에러");
        else{
            res.status(200).json(userInfo);
        }
    })
});

router.post("/getLTID",function (req,res,next) {
    var tel = req.query.tel;
    console.log(tel+"입니다.");
    console.log("LTID");
    var userInfo = new UserInfo();
    userInfo.getLTID(tel,function (err,user) {
        if(err) return console.log("error");
        else{
            console.log(user);
            res.status(200).json(user);
        }
    })
});


module.exports = router;