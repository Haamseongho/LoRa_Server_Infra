var express = require("express");
var router = express.Router();
var Admin = require("../models/adminDB");

router.get("/admin/signup",function(req,res,next){
    var email = req.query.email;
    var user_uid = req.query.user_uid;

    Admin.findOne({ email : email , user_uid : user_uid }, function(err,admin){
         if(err) return console.log('error find admin');
         return res.status(200).json(admin);
   });
});

router.post("/admin/signup",function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    var user_uid = req.body.user_uid;
    var adminLocation = req.body.adminLocation;
    var admin = new Admin({
        email : email,
        password : password,
        user_uid : user_uid ,
        adminLocation : adminLocation
   });   

    console.log(admin);
    admin.save(function(err,admin){
         if(err) return console.log("error to save admin data");
         return res.status(200).json(admin);
    });
});



//
// router.put('/admin/change/location',function(req,res,next){
//      var beforeLocation = req.body.adminLocation;
//
// });

module.exports = router;
