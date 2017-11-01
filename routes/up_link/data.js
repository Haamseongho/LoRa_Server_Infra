var express = require("express");
var router = express.Router();
var dynamicData = require("../../models/dynamicDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
var db = mongoose.connection;
var request = require("request");
var app = express();
var push = require("./push"); // FCM PUSH

app.set(bodyParser.json());
app.set(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());


router.route("/data").post(function (req, res, next) {
    var data = new Array();  // sr 정보 뽑기 위함
    var data2 = new Array(); // LTID 체크 하기 위함 
    console.log(req.url);
    console.log(req.method);
    console.log(req.body);

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

    if (pulse < 90 ) {
	push(router,function(err,data){
	    if(err) console.log("푸시 전송 실패");
	    else console.log("푸시 전송 성공");
	});
    }


    dynamic.save(function (error, data) {
        if (error) console.log("error saved user's Data");
        else console.log('data saved well');
    });
});

router.get("/push/message",function(req,res,next){
    console.log("push message get방식");
});
router.post("/push/message",function(req,res,next){
    console.log("/push/message 전송 성공");
    push(router,function(err,data){
	if(err) return console.log("푸시 메시지 전송 완료");
	else return console.log("푸시 메시지 전송 에러");	
    });
});

module.exports = router;
