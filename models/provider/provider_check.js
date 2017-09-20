/**
 * Created by haams on 2017-09-20.
 */
var express = require("express");
var router = express.Router();
module.exports = function (req,provider) {
    var name;
    switch(provider){
        case "facebook":{
            name = req.user._json.name;
        }
        break;

        case  "kakao":{
            name = req.user._json.kaccount_email;
        }
        break;
    }
    return name;
};