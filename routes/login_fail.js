/**
 * Created by haams on 2017-05-17.
 */
var express = require("express");
var router = express.Router();

router.get("/login_fail",function (req,res,next) {
    console.log("login fail");
});
module.exports = router;