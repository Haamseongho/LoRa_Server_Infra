var express = require("express");
var router = express.Router();
var dynamicData = require("../../models/dynamicDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
var db = mongoose.connection;

var app = express();
var request = require("request");

app.set(bodyParser.json());
app.set(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());


var Fcm = require("fcm-node");
var serverKey = "AAAAkNmJaXU:APA91bE0QYvaSD-yXIR0BfYETtD9WRfve90kgAn9LP5LZtEOW0n5hwOVOs2oP9bc5tcHD9czK_oUl3lKYC0AVuPxj432LQJry7Q4kGOfrEv1G5KUmuy_WgF5Yev4hDYuUvX1B9t9hnIq";

var fcm = new Fcm(serverKey);

var message = {
        "to":"cKSgvj1FDN4:APA91bHeBUZ4sWsHGYrslyFU2lowTt4115fxXvQkaIAoTdo8C0sMZQ0j4lVfkUqtEXksHo5IPlKhQfS8vSftCmcQ60xm8ZIARTxhL9_DXIpWPbmoOR6J_szIU1odcRrjL3dJBv5iu5jl",
        "notification" : {
            "body" : "디바이스 사용자의 맥박이 이상 수치로 측정되었습니다. 빠른 조치가 필요합니다.",
            "title": "위험 상황! 노인 분께서 위험합니다!"
        },
        "data":{
            "name":"디바이스 착용자 위험 상황 알림",
            "body":"맥박이 이상 수치로 측정되었습니다. 빠르게 조치해야 합>니다!"
        }
    };


router.post("/data", function (req, res, next) {
    var data = new Array();  // sr 정보 뽑기 위함
    var data2 = new Array(); // LTID 체크 하기 위함 


    data = req.body['m2m:cin']['sr'][0].split("/");


   // var lat = req.body['m2m:cin']['con'][0].substr(0, 2) + '.' + req.body['m2m:cin']['con'][0].substr(2, 6); // 0 - lat , 1 - lng , 2 - pulse
   // var lon = req.body['m2m:cin']['con'][0].substr(8, 3) + "." + req.body['m2m:cin']['con'][0].substr(11, 6);
    var pulse = req.body['m2m:cin']['con'][0];
    var lat = req.body['m2m:cin']['ppt'][0]['gwl'][0].substr(0,8);
    var lon = req.body['m2m:cin']['ppt'][0]['gwl'][0].substr(9,9);

    data2 = data[3].split('-');
    var LTID = data2[1];
    console.log(LTID+"측정된 LTID");

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
/*
    if (pulse < 60 || pulse > 140) {
        fcmPush(router, function (err) {
            if (err) console.log(new Error("푸쉬 알림 전송 실패"));
            else console.log("푸쉬 알림 전송 성공");
        });
    }
*/
    if(pulse < 60 || pulse > 140){
	var json_obj = {"msg":"hi","aa":["aaa","aaaa"]};
	request.post({
	   url : "http://52.79.83.51:2721/push/message",
	   body : json_obj,
	   json : true
        },function(error,response,body){
	  console.log(body);
	  res.end();
	});
    }

    dynamic.save(function (error, data) {
        if (error) console.log("error saved user's Data");
        else console.log('data saved well');
    });

});

router.post("/push/message",function(req,res,next){
    console.log(req.url);
    fcm.send(message,function(err,response){
	if(err) console.log("메시지 전송 실패");
	else console.log("메시지 전송 성공");
    });
});

module.exports = router;
