var express = require("express");
var router = express.Router();
var User = require("../models/userDB");
router.get("/",function(req,res,next){
  var name = req.query.name;

  User.findOne({name:name},function(error,user){
      if(error) return res.status(404).send(new Error('finding user is not working'));
      return res.status(200).json(user);
  });
});
module.exports = router;
