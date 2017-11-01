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
        "to":"cKSgvj1FDN4:APA91bHeBUZ4sWsHGYrslyFU2lowTt4115fxXvQkaIAoTdo8C0sMZQ0j4lVfkUqtEXksHo5IPlKhQfS8vSftCmcQ60xm8ZIARTxhL9_DXIpWPbmoOR6J_szIU1odcRrjL3dJBv5iu5jl",
        "notification" : {
            "body" : "디바이스 사용자의 맥박이 이상 수치로 측정되었습니다. 빠른 조치가 필요합니다.",
            "title": "위험 상황! 노인 분께서 위험합니다!"
        },
        "data":{
            "name":"디바이스 착용자 위험 상황 알림",
            "body":"맥박이 이상 수치로 측정되었습니다. 빠르게 조치해야 합니다!"
        }
    };

    router.post("/push/message",function (req,res,next) {
        fcm.send(message,function (err,response) {
            if(err) console.log("메세지 전송 실패");
            else console.log("메세지 전송 성공");
        })
    });
};
