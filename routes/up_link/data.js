var express = require("express");
var router = express.Router();
var dynamicData = require("../../models/dynamicDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
var db = mongoose.connection;

var app = express();
var fcmPush = require("./push"); // FCM PUSH

app.set(bodyParser.json());
app.set(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());


router.post("/", function (req, res, next) {
    var data = new Array();  // sr 정보 뽑기 위함
    var data2 = new Array(); // LTID 체크 하기 위함 


    data = req.body['m2m:cin']['sr'][0].split("/");


    var lat = req.body['m2m:cin']['con'][0].substr(0, 2) + '.' + req.body['m2m:cin']['con'][0].substr(2, 6); // 0 - lat , 1 - lng , 2 - pulse
    var lon = req.body['m2m:cin']['con'][0].substr(8, 3) + "." + req.body['m2m:cin']['con'][0].substr(11, 6);
    var pulse = req.body['m2m:cin']['con'][0].substr(17, 3);



    data2 = data[3].split('-');
    var LTID = data2[1];
    console.log(LTID);

    var dynamic = new dynamicData({
        LTID: LTID,
        pulse: pulse,
        lat: lat,
        lon: lon,
        time: req.body['m2m:cin']['ct'][0]
    });

    console.log(lat + "위도");
    console.log(lon + '경도');
    console.log(pulse + '맥박');

    if (pulse < 60 || pulse > 140) {
        fcmPush(router, function (err) {
            if (err) console.log(new Error("푸쉬 알림 전송 실패"));
            else console.log("푸쉬 알림 전송 성공");
        });
    }


    dynamic.save(function (error, data) {
        if (error) return res.json("error saved user's Data");
        return res.send('send well');
    });
});

module.exports = router;
