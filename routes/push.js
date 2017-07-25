var express = require("express");
var http = require("http");
var router = express.Router();
var FCM = require('fcm-node');
var serverKey = require('./path/to/privatekey.json');
var fcm = new FCM(serverKey);
var moment = require('moment');
//var Push = require("../models/pushDB");
var User = require("../models/userDB");

var admin = require("firebase-admin");


var message = {
   to : "AAAAkNmJaXU:APA91bHR-bhH6axCpvnzW5ZQm8WyttZef_t19BIE11SZdkiNYxuyiytmwVp32xBo2fyANvzmxt9vJCC5sv5Xf6-gkKsXBRDtblWlZjVsjJZT6Tsr7QSbaHlaod0SMvE-lr9XUGNHhlnq",
   notification : {
         title: 'help',
         body: '환자 발생!! 위험 상황입니다'
   },
   data : {
      'name':'test',
      'body':'test..ing',
      'room':'ubinet'
   }
};

router.post("/",function(req,res,next){
   var beatData = req.body.beatData;
   var heartData = req.body.heartData;
   User.findOne({ beatData:{ $lt:50.0 } , heartData : { $lt:50.0 }},function(err,user){
	if(err) console.log('error - heartbeat');
        fcm.send(message,function(err,response){
           if(err) console.log('somthing has gone!');
           else console.log('successfully sent with response! ' + response);
      });
	return res.status(200).json(user);
   });
});

/*
router.post("/",function(req,res,next) {
    var to = req.param.to;
    var content = req.param.content;
    User.findOne({ content : content , content : { $lt : 60 } 
, content : { $gt : 140 } ,function(error,user){ // 맥박 60 이하 or 140 이상
        if(error) return res.status(404).send("user is ok");
        return console.log('good'); // user -- 문제 있는 애 보내기
  });    

   
//    Push.findOne({
//        name: name, function(err, push){
//            if (err) return res.status(404).send('push message is not ready');
//            else {
//                var date = moment().format('YYYY[/]MM[/]DD HH:mm:ss');
//                var message = [name, "환자가 위험한 상황입니다!!", date];
//
//
//                var push = new Push({
//                    name: name,
//                    message: message,
//                    created_at: date
//                });
//
//                push.save(function (error, push) {
//                    if (error) return res.json('error saved push message');
//                    return res.send('push message is made');
//                });
//
//                fcm.send(message, function (err, response) {
//                    if (err) console.log('fcm messaging system is on error');
//                    else {
//                        console.log('Successfully send with response : ', response);
//                    }
//                });
//            }
//        }
// }

}
});
*/
module.exports = router;

