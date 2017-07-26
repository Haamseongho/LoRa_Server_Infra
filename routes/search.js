var express = require("express");
var router = express.Router();
var User = require("../models/userDB");
var bodyParser = require("body-parser");
require('body-parser-xml')(bodyParser);
var app = express();
/*
 app.set(bodyParser.json());
 app.set(bodyParser.urlencoded({ extended : true }));
 app.use(bodyParser.xml());
 */
router.get("/",function(req,res,next){
    var name = req.query.name;
    var LTID = req.query.LTID;


    console.log(req.query);
    User.findOne({ name : name , LTID : LTID } ,function(err,user){
        if(err)res.status(404).send("Error user");
        return res.status(200).json(user);
    });
});


/*
 user.findData(req.body.name,function(err,user){
 console.log('user Data is sended well');
 if(err) return res.status(404).send(new Error('user not found'));
 return res.status(200).json(user);
 });
 */
/*
 user.findData(req.body.name,function(err,user){
 console.log("user's Data is sended well by its name");
 if(err) return res.status(404).send(new Error("user Not Found"));
 return res.status(200).json(user);


 })
 */

module.exports = router;
