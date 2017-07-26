var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var addUserSchema = new Schema({
    LTID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    add_disease: {
        type: String
    },
    visit: {
        type: String
    },
    visit_schedule: {
        type: String
    },
    Doctor_ID:{
        type:String
    },
    care:{
        type:String
    }
});

var Adduser = mongoose.model("Adduser", addUserSchema);

module.exports = Adduser;
