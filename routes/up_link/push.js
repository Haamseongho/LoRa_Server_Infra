/**
 * Created by haams on 2017-08-12.
 */
var express = require("express");
var router = express.Router();
var Fcm = require("fcm-node");
var serverKey = "AAAAkNmJaXU:APA91bE0QYvaSD-yXIR0BfYETtD9WRfve90kgAn9LP5LZtEOW0n5hwOVOs2oP9bc5tcHD9czK_oUl3lKYC0AVuPxj432LQJry7Q4kGOfrEv1G5KUmuy_WgF5Yev4hDYuUvX1B9t9hnIq";

var fcm = new Fcm(serverKey);

module.exports = function (router,callback) {

    var message = {
        "to":"cbntaFliIV8:APA91bGJLtvm1zk4LYLxImb5Ctk8qhT9UdDzztgfH3PUgD9OBEP5upcYIYOCHvQN85Ne06KJc5IKhu_taakGZ-zGm--vcMLfNPt8XGOgno9nMTCAc9UiFKzucQibjWM2EBOlVV8YnEvD",
        "notification" : {
            "body" : "디바이스 사용자의 맥박이 이상 수치로 측정되었습니다. 빠른 조치가 필요합니다.",
            "title": "위험 상황! 노인 분께서 위험합니다!"
        },
        "data":{
            "name":"디바이스 착용자 위험 상황 알림",
            "body":"맥박이 이상 수치로 측정되었습니다. 빠르게 조치해야 합니다!"
        }
    };

    router.post("/message",function (req,res,next) {
        fcm.send(message,function (err,response) {
            if(err) console.log("메세지 전송 실패");
            else console.log("메세지 전송 성공");
        })
    });
};
