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
            "body" : "알림",
            "title": "제목"
        },
        "data":{
            "name":"haams",
            "body":"great!"
        }
    };

    router.post("/message",function (req,res,next) {
        fcm.send(message,function (err,response) {
            if(err) console.log("메세지 전송 실패");
            else console.log("메세지 전송 성공");
        })
    });
};
