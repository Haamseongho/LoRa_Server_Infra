var express = require("express");
var router  = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var pushSchema = new Schema({
    to : {
      type:String,
      required: true
    },
    message :  {
      type:String,
      required:true,
      trim : true
   },
      created_at :{
      type:Date
   }
});

var Push = mongoose.model("Push",pushSchema);


module.exports = Push;
