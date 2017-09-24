/**
 * Created by haams on 2017-09-12.
 */
var express = require("express");
var router = express.Router();


router.get("/main", function (req, res, next) {
    console.log("main이 울렸습니다.");
    if (req.user.provider == "facebook") {
        console.log(req.user.nickname);
    } else if (req.user.provider == "kakao") {
        console.log(req.user.name);
    }
});

module.exports = router;