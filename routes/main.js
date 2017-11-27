/**
 * Created by haams on 2017-09-12.
 */
var express = require("express");
var router = express.Router();
var Dynamic = require("../models/dynamicDB");
var Guardian = require("../models/guardianDB");
router.get("/main", function (req, res, next) {
    console.log("main이 울렸습니다.");
    if (req.user.provider == "facebook") {
        console.log(req.user.nickname);
	checkUserStatus(req.user.nickname,function(err,data){
	     if(err) console.log('nickname-- facebook error');
	     else console.log('nickname -- facebook succeeded');
	});
    } else if (req.user.provider == "kakao") {
        console.log(req.user.name);
	checkUserStatus(req.user.name,cb);
    }

    console.log(index);
});

function checkUserStatus(name,cb){
    Guardian.collection.findOne({name:name},function(err,guard){
       console.log("LTID : "  + guard.LTID);
       Dynamic.collection.find({LTID : guard.LTID}).sort({time:-1}).toArray(function(err,dynamics){
	   checkUserPulse(dynamics,function(err,data){
		if(err) console.log("맥박 체크 실패");
		else console.log("맥박 체크 성공");
	   });
       });
    });
}

function checkUserPulse(dynamics,cb){
   console.log(dynamics.length+"길이");
   for(var i=0;i<dynamics.length;i++){
	console.log(dynamics[i].pulse);
   }
}

module.exports = router;
