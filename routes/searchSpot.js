var express = require("express");
var router = express.Router();
var User = require("../models/userDB");


router.get("/",function(req,res,next){
   var name = req.query.name;
   var age = req.query.age;
   var spot = req.query.spot;

   User.findOne({name : name , age : age , spot : spot }, function(err,user){
       if(err) return res.status(404).send("error");
       return res.status(200).json(user);
   });
});
module.exports = router;
