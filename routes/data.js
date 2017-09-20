var express = require("express");
var router = express.Router();
var dynamicData = require("../models/dynamicDB");
var mongoose = require("mongoose");
var db = mongoose.connection;
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
var db = mongoose.connection;

var app = express();
var user = undefined;

app.set(bodyParser.json());
app.set(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.xml());


router.post("/", function (req, res, next) {
    var data = new Array();  // sr 정보 뽑기 위함
    var data2 = new Array(); // LTID 체크 하기 위함 
    //var data3 = new Array(); // con 데이터 수정 하기 위함
   
    data = req.body['m2m:cin']['sr'][0].split("/");
  //  data2 = data[2].split['-'];

    var lat = req.body['m2m:cin']['con'][0].substr(0,2)+'.'+req.body['m2m:cin']['con'][0].substr(2,6); // 0 - lat , 1 - lng , 2 - pulse
    var lon = req.body['m2m:cin']['con'][0].substr(8,3)+"."+req.body['m2m:cin']['con'][0].substr(11,6);
    var pulse = req.body['m2m:cin']['con'][0].substr(17,3);
 //   var lat = data3[0];
 //   var lon = data3[1];
 //   var pulse = data3[2];

    data2 = data[3].split('-');
    var LTID = data2[1];
    console.log(LTID);  
 /*
    var dynamic = new dynamicData({
        LTID : LTID,
        pulse : pulse,
        lat : lat,
        lon : lon,
        time : req.body['m2m:cin']['ct'][0]
    });
*/
  //  console.log(user);
  //   console.log(req.body['m2m:cin']['ci'][0]);
    console.log(lat+"위도");
    console.log(lon+'경도');
    console.log(pulse+'맥박');
/*
    dynamic.save(function (error, data) {
        if (error) return res.json("error saved user's Data");
        return res.send('send well');
    });
*/
});


router.get("/", function (req, res, next) {
    user.findData(req.body.name, function (err, user) {
        if (err) return res.status(404).send(new Error("user Not Found"));
        return res.status(200).json(user);
    })
});


module.exports = router;
