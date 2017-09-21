/**
 * Created by haams on 2017-09-20.
 */
var express = require("express");
var router = express.Router();
module.exports = function (req,provider) {
    const name;
    switch(provider){
        case "facebook": { 
            var facebook = { name : req.user._json.name }
                      
       }
        break;

        case  "kakao":{ 
            var kakao =  { name : req.user._json.kaccount_email }
       }
        break;
    }
    return {
             facebook : facebook.name,
             kakao : kakao
   };
};
